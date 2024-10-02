import { Injectable } from '@nestjs/common';
import {
  IValidateToken,
  LogOutRequest,
  Login,
  RefreshTokenRequest,
  UpdatePassword,
} from './authentification.model';
import { createHash, randomBytes } from 'crypto';

import * as cheerio from 'cheerio';
import * as URL from 'url';
import {
  AuthenticationErrors,
  UnknownKeycloakError,
} from './authentification.error';
import * as Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { jwtDecode } from 'jwt-decode';
import { HttpService } from '@nestjs/axios';
import * as querystring from 'querystring';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { Result } from 'src/shared/result/result.model'; 
import { ConnexionKeycloakService } from 'src/connexion-keycloak.service'; 
import { promisify } from 'util';

const assert=require('assert');

@Injectable()
export class AuthenticationService {
  private redisClient: Redis.Redis;
  applicationId: string;
  keycloak_base_url: string;
  keycloak_redirect_uri: string;
  keycloak_client_secret: string;
  keycloakLogoutUri: string;
  requiredActions = ['TERMS_AND_CONDITIONS', 'UPDATE_PASSWORD'];
  
  private getAsync: any;
  private setAsync: any;


  constructor(
    private readonly configservice: ConfigService,
    private readonly _http: HttpService,
    private connexionKeycloak: ConnexionKeycloakService,
  ) {
    this.redisClient = new Redis.Redis({
      host: this.configservice.get('REDIS_HOST'),
      port: this.configservice.get('REDIS_PORT'),
    });

    this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    this.setAsync = promisify(this.redisClient.set).bind(this.redisClient);

    
    this.applicationId = this.configservice.get('KEYCLOAK_CLIENT_ID');
    this.keycloak_base_url = this.configservice.get('KEYCLOAK_BASE_URL');
    this.keycloak_redirect_uri = this.configservice.get(
      'KEYCLOAK_REDIRECT_URI',
    );
    this.keycloak_client_secret = this.configservice.get(
      'KEYCLOAK_CLIENT_SECRET',
    );
    this.keycloakLogoutUri = this.configservice.get('KEYCLOAK_LOGOUT_URI');
  }
 
  urlBase64(content: any) {
    content = content.toString('base64');
    const urlSafeReplacements = [
      [/\+/g, '-'],
      [/\//g, '_'],
      [/=/g, ''],
    ];
 
    urlSafeReplacements.forEach(([test, replacement]) => {
      content = content.replace(test, replacement);
    });
    return content;
  }

  createCodeVerifier() {
    return this.urlBase64(randomBytes(32));
  }

  createCodeChallenge(verifier) {
    const hash = createHash('sha256').update(verifier).digest();
    return this.urlBase64(hash);
  }

  getRequiredAction(loginText) {
    const documentLogin = cheerio.load(loginText);
    const formActionLogin = documentLogin('form').attr('action');

    const actionUrl = new URL.URL(formActionLogin);
    const actionParams = new URLSearchParams(actionUrl.search);
    const execution = actionParams.get('execution');

    const error = documentLogin('.kc-text-error').text();

    let response = {};

    if (error != '') {
      response = { error: error };
    }

    if (this.requiredActions.indexOf(execution) == -1) {
      throw Error('Invalid credentials');
    }

    switch (execution) {
      case 'TERMS_AND_CONDITIONS':
        const requiredActionText = documentLogin('#kc-terms-text p').text();
        return {
          ...response,
          execution: 'TERMS_AND_CONDITIONS',
          formAction: formActionLogin,
          text: requiredActionText,
        };
        break;
      case 'UPDATE_PASSWORD':
        return {
          ...response,
          execution: 'UPDATE_PASSWORD',
          formAction: formActionLogin,
        };
        break;
      case 'ZIWIG_VERIFY_EMAIL':
        return {
          ...response,
          execution: 'ZIWIG_VERIFY_EMAIL',
          formAction: formActionLogin,
        };
        break;
      case 'ZIWIG_VERIFY_PHONE':
        return {
          ...response,
          execution: 'ZIWIG_VERIFY_PHONE',
          formAction: formActionLogin,
        };
        break;
    }
  }

  async submitRequiredActionOrAuthorizationCode(req) {
    let data = {};

    if (
      req.hasOwnProperty('execution') &&
      this.requiredActions.indexOf(req.execution) > -1
    ) {
      switch (req.execution) {
        case 'TERMS_AND_CONDITIONS':
          data = { cancel: 'Decline' };

          if (
            req.hasOwnProperty('acceptValue') &&
            (req['acceptValue'] == 'Accept' || req['acceptValue'] == 'Decline')
          ) {
            if (req['acceptValue'] == 'Accept') {
              data = { accept: 'Accept' };
            }
          } else {
            throw new Error('missing accept value !');
          }
          break;
        case 'UPDATE_PASSWORD':
          if (
            req.hasOwnProperty('newPassword') &&
            req.hasOwnProperty('confirmPassword')
          ) {
            data = {
              'password-new': req.newPassword,
              'password-confirm': req.confirmPassword,
            };
          } else {
            throw new Error('missing password or confirm password !');
          }
          break;
        case 'ZIWIG_VERIFY_EMAIL':
          if (req.hasOwnProperty('code')) {
            data = { code: req.code };
          } else {
            throw new Error('missing code !');
          }
          break;
        case 'ZIWIG_VERIFY_PHONE':
          if (req.hasOwnProperty('code')) {
            data = { code: req.code };
          } else {
            throw new Error('missing code !');
          }
          break;
        default:
          throw new Error('Invalid Request');
      }
    } else {
      throw new Error('Invalid execution');
    }
    const body = querystring.stringify(data);

    const login = await fetch(req.formAction, {
      body,
      headers: {
        Cookie: req.cookie,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const loginUrl = new URL.URL(login.url);
    const urlParams = new URLSearchParams(loginUrl.search);
    const code = urlParams.get('code');

    if (code) {
      const response = {
        code: code,
      };
      return response;
    } else {
      const requiredAction = await this.getRequiredAction(await login.text());
      return { ...requiredAction, cookie: req.cookie };
    }
  }

  async getRequiredActionsOrAuthorizationCode(challenge, req) {

    const params = querystring.stringify({
      response_type: 'code',
      scope: 'openid profile email',
      client_id: this.applicationId,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      redirect_uri: this.keycloak_redirect_uri,
    });

    const loginPageResponse = await fetch(
      `${this.configservice.get(
        'KEYCLOAK_URL',
      )}/protocol/openid-connect/auth?${params}`,
    );

    const document = cheerio.load(await loginPageResponse.text());

    const formAction = document('form').attr('action');

    console.log("formAction", formAction);

    assert(formAction, 'Failed to get form submission uri.');

    const body = querystring.stringify({
      username: req.username,
      password: req.password,
      rememberMe: req.rememberMe,
    });
 
    const login = await fetch(formAction, {
      body,
      headers: {
        Cookie: loginPageResponse.headers.get('Set-Cookie'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
    
    console.log("loginlogin ::",login);

    if (login.status == 500) throw new Error('Internal Server Error');

    const loginUrl = new URL.URL(login.url);
    const urlParams = new URLSearchParams(loginUrl.search);
    const code = urlParams.get('code');

    if (code) {
      const response = {
        code: code,
      };
      return response;
    } else {
      const requiredAction = await this.getRequiredAction(await login.text());
      return {
        ...requiredAction,
        cookie: loginPageResponse.headers.get('Set-Cookie'),
      };
    }
  } 

  async assertAuthorizationCodeFlowWithPkce(req) {
    let verifier = '';
    let data;
    if (req.hasOwnProperty('username') && req.hasOwnProperty('password')) {
      verifier = this.createCodeVerifier();
      const challenge = this.createCodeChallenge(verifier);

      console.log('before daata', challenge);

      data = await this.getRequiredActionsOrAuthorizationCode(challenge, req);

      if (data.hasOwnProperty('isFailure')) {
        return Result.Fail(
          AuthenticationErrors.unauthorizedError('Invalid credentials'),
        );
      }
    } else if (
      req.hasOwnProperty('execution') &&
      req.hasOwnProperty('formAction')
    ) {
      verifier = await this.redisClient.get(
        `verifier_session`,
        (error, result) => {
          if (error) {
            console.error('Error:', error);
          } else {
            console.log('Result:', result);
            return result;
          }
        },
      );
      data = await this.submitRequiredActionOrAuthorizationCode(req);
 
      if (data.hasOwnProperty('isFailure')) {
        return Result.Fail(
          AuthenticationErrors.unauthorizedError('Invalid credentials'),
        );
      }
    }

    if (!data.hasOwnProperty('code')) {
      this.redisClient.set(`verifier_session`, verifier, (error, result) => {
        if (error) {
          console.error('Error:', error);
        } else {
          console.log('Result:', result);
        }
      });

      return data;
    } else {
      this.redisClient.del(`verifier_session`, (error, result) => {
        if (error) {
          console.error('Error:', error);
        } else {
          console.log(`Successfully removed key: verifier_session`);
        }
      });

      console.log(verifier);

      const response = await this.exchangeCodeForTokens(data.code, verifier);

      assert.strictEqual(
        response.status,
        200,
        'Failed to exchange code for tokens',
      );

      return response.json();
    }
  }

   async login(req: Login) {
    try {
      const response = await this.assertAuthorizationCodeFlowWithPkce(req);
      
      console.log('Response :', response);
  
      if (
        response.hasOwnProperty('execution') &&
        response.hasOwnProperty('formAction')
      ) {
        return Result.OK(response);
      }
  
      let user = await this.getUserByToken(response['access_token']);
      const decodedToken = jwtDecode(response['access_token']);
      const groups = decodedToken['roles'] || [];
  
      if (user.isFailure) {
        return user;
      }
  
      user = await user.getValue();
      this.redisClient.set(
        `sessionToken:${user['sub']}`,
        response['access_token'],
        (error, result) => {
          if (error) {
            return Result.Fail(error);
          }
        },
      );
      this.redisClient.set(
        `refreshToken:${user['sub']}`,
        response['refresh_token'],
        (error, result) => {
          if (error) {
            return Result.Fail(error);
          }
        },
      );
  
      let authenticatedUser: any = {
        userId: user['sub'],
        email: user['email'],
        groups: decodedToken['groups'],
        roles: [
          ...(decodedToken['resource_access'][process.env.KEYCLOAK_CLIENT_ID]?.roles || []),
          ...(decodedToken['realm_access'][process.env.KEYCLOAK_REALM]?.roles || [])
        ]
      };
  
      // Logging for debugging purposes
      console.log('Decoded Token:', decodedToken);
      console.log('Realm Access Roles:', decodedToken['realm_access']);
      console.log('Resource Access Roles:', decodedToken['resource_access']);
  
      const decoded = jwtDecode(response['access_token']);
      if (decoded['acr'] && decoded['acr'] === 'username_password') {
        authenticatedUser = {
          ...authenticatedUser,
          access_token: response['access_token'],
          refresh_token: response['refresh_token'],
        };
      }
  
      return Result.OK({
        message: 'Step 1: User verified',
        authLevel: decoded['acr'],
        ...authenticatedUser,
        access_token: response['access_token']
      });
    } catch (error) {
      console.log("error:", error);
  
      if (error.code === 'ERR_INVALID_URL') {
        return Result.Fail(AuthenticationErrors.notFoundError('Invalid_url'));
      }
      if (error.message === 'Invalid credentials') {
        return Result.Fail(
          AuthenticationErrors.unauthorizedError('Invalid credentials'),
        );
      }
      return Result.Fail(AuthenticationErrors.unauthorizedError(error.message));
    }
  }
   

  async exchangeCodeForTokens(code, verifier, removeVerifier = false) {
    const body = {
      grant_type: 'authorization_code',
      client_id: this.applicationId,
      code_verifier: verifier,
      client_secret: this.keycloak_client_secret,
      code,
      redirect_uri: this.keycloak_redirect_uri,
    };

    if (removeVerifier) {
      delete body.code_verifier;
    }
    return fetch(
      `${this.configservice.get('KEYCLOAK_URL')}/protocol/openid-connect/token`,
      {
        body: querystring.stringify(body),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        redirect: 'manual',
      },
    );
  }

  // ------ Get User By Token----------
  async getUserByToken(token) {
    try {
      // configure the request to your keycloak server
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        method: 'GET',
      };

      // send a request to the userinfo endpoint on keycloak
      const response = await fetch(
        `${this.configservice.get(
          'KEYCLOAK_URL',
        )}/protocol/openid-connect/userinfo`,
        options,
      );
      if (response.status !== 200)
        return Result.Fail(
          AuthenticationErrors.unauthorizedError('user_login_expired'),
        );
      return Result.OK(response.json());
    } catch (error) {
      return Result.Fail(error);
    }
  }

  // ------ Get User Role By Token ----------
// ------ Get User Role By Token ----------
async getUserRoleByToken(token: string): Promise<Result<string>> {
  try {
    // Configuration de la requête à votre serveur Keycloak
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'GET',
    };

    // Envoi d'une requête à l'endpoint userinfo de Keycloak
    const response = await fetch(
      `${this.configservice.get(
        'KEYCLOAK_URL',
      )}/protocol/openid-connect/userinfo`,
      options,
    );

    if (response.status !== 200) {
      return Result.Fail('user_login_expired');
    }

    const userInfo = await response.json();

    // Supposant que les rôles sont contenus dans les claims de l'utilisateur
    const roles = userInfo.realm_access?.roles || [];
    
    // Récupérer le rôle principal de l'utilisateur (ajuster selon votre logique)
    let userRole: string;
    if (roles.includes('ADMIN')) {
      userRole = 'ADMIN';
    } else if (roles.includes('PROJECT_MANAGER')) {
      userRole = 'PROJECT_MANAGER';
    } else if (roles.includes('AUDITOR')) {
      userRole = 'AUDITOR';
    } else {
      userRole = 'USER'; // Rôle par défaut ou autre
    }

    return Result.OK(userRole);
  } catch (error) {
    return Result.Fail(error);
  }
}

  // ------ Validate Token----------
  async validateToken(validationObject: IValidateToken) {
    const body = {
      client_id: validationObject.client_id || this.applicationId,
      client_secret:
        validationObject.client_secret || this.keycloak_client_secret,
      token: validationObject.token,
    };
    const result = this._http
      .post(
        this.configservice.get('KETCLOAK_TOKEN_VALIDATION_URI'),
        querystring.stringify(body),
      )
      .pipe(
        map((res) => {
          return Result.OK(res.data);
        }),
        catchError((e) => {
          return of(
            Result.Fail(
              UnknownKeycloakError.create(
                e.response?.data?.errorMessage || 'error_validate_token',
              ),
            ),
          );
        }),
      );
    return lastValueFrom(result);
  }

  getContentType() {
    return { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
  }

  //-------refresh token------------------
  async refreshAccessToken(
    data: RefreshTokenRequest,
  ): Promise<Result<any> | Result<Error>> {
    const params = {
      grant_type: 'refresh_token',
      client_id: data.applicationid || this.applicationId,
      client_secret: data.clientSecret || this.keycloak_client_secret,
      refresh_token: data.refresh_token,
      redirect_uri: data.redirect_uri || this.keycloak_redirect_uri,
    };
    const result = this._http
      .post(
        this.configservice.get('KEYCLOAK_TOKEN_URI'),
        querystring.stringify(params),
        this.getContentType(),
      )
      .pipe(
        map(async (res) => {
          let user = await this.getUserByToken(res.data['access_token']);
          if (user.isFailure) {
            return user;
          }
          user = await user.getValue();
          this.redisClient.set(
            `sessionToken:${user['sub']}`,
            res.data['access_token'],
            (error, result) => {
              if (error) {
                return Result.Fail(error);
              }
            },
          );
          this.redisClient.set(
            `refreshToken:${user['sub']}`,
            res.data['refresh_token'],
            (error, result) => {
              if (error) {
                return Result.Fail(error);
              }
            },
          );
          return Result.OK(res.data);
        }),
        catchError((e) => {
          return of(
            Result.Fail(
              UnknownKeycloakError.create(
                e.response?.data?.errorMessage || 'error_refresh_token',
              ),
            ),
          );
        }),
      );
    return lastValueFrom(result);
  }

  async logout(data: LogOutRequest): Promise<Result<any> | Result<Error>> {
    const params = {
      client_id: data.applicationid || this.configservice.get('KEYCLOAK_CLIENT_ID'),
      client_secret: data.clientSecret || this.configservice.get('KEYCLOAK_CLIENT_SECRET'),
      refresh_token: data.refresh_token,
    };
  
    console.log('Logout Params:', params);  // Log the params for debugging
  
    const result = this._http
      .post(
        this.keycloakLogoutUri,
        querystring.stringify(params),
        this.getContentType(),
      )
      .pipe(
        map((res) => {
          return Result.OK(res.data);
        }),
        catchError((e) => {
          // Log detailed error information
          console.error('Error during logout:', e.response?.data || e.message);
          return of(
            Result.Fail(
              UnknownKeycloakError.create(
                e.response?.data?.error_description || 'error_logout',
              ),
            ),
          );
        }),
      );
    return lastValueFrom(result);
  }
  

  /*async logout(data: LogOutRequest): Promise<Result<any> | Result<Error>> {
    const params = {
      client_id:
        data.applicationid || this.configservice.get('KEYCLOAK_CLIENT_ID'),
      client_secret:
        data.clientSecret || this.configservice.get('KEYCLOAK_CLIENT_SECRET'),
      refresh_token: data.refresh_token,
    };
    const result = this._http
      .post(
        this.keycloakLogoutUri,
        querystring.stringify(params),
        this.getContentType(),
      )
      .pipe(
        map((res) => {
          return Result.OK(res.data);
        }),
        catchError((e) => {
          return of(
            Result.Fail(
              UnknownKeycloakError.create(
                e.response?.data?.errorMessage || 'error_logout',
              ),
            ),
          );
        }),
      );
    return lastValueFrom(result);
  }
*/
  // ----- For Password Policy
  public async getDomainPolicies(
    domain: string,
  ): Promise<Result<any> | Result<Error>> {
    try {
      const realm = await this.connexionKeycloak.adminClient.realms.findOne({
        realm: domain,
      });
      return Result.OK(realm.passwordPolicy);
    } catch (error) {
      return Result.Fail(
        UnknownKeycloakError.create(
          error.response?.data?.errorMessage || 'error_get_realm',
        ),
      );
    }
  }

  // Update Password
  public async updatePassoword(input: UpdatePassword) {
    const realm = this.configservice.get('KEYCLOAK_REALM');
    const decodeToken = jwtDecode(input.token) as { sub: string };
    const userId = decodeToken.sub;
    console.log('Decoded User ID:', userId);
  console.log('Realm:', realm);
  console.log('Authorization Token:', input.token);
    const result = this._http
      .put(
        `${this.keycloak_base_url}/admin/realms/${realm}/users/${userId}/reset-password`,
        { value: input.newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${input.token}`,
          },
        },
      )
      .pipe(
        map((res) => {
          return Result.OK(res.data);
        }),
        catchError((e) => {
          //console.error('Error from Keycloak:', e.response); // Detailed error response
          return of(
            Result.Fail(
              UnknownKeycloakError.create(
                e.response?.data?.errorMessage || 'error_update_password',
              ),
            ),
          );
        }),
      );

    return lastValueFrom(result);
  }

  async verifyUser(searchValue: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.configservice.get(
          'KEYCLOAK_URL',
        )}/update-credential/users?search=${searchValue}`,
      );
      console.log('response', response.ok);
      console.log('response', response.status, response.statusText);

      if (response.status === 404) {
        return { message: 'Utilisateur non trouvé' };
      }

      if (!response.ok) {
        throw new Error('Error verifying user');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log('error', error);
      throw new Error('Error verifying u');
    }
  }

  async sendCodeForReset(
    clientId: string,
    userSessionId: string,
    otpType: string,
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.configservice.get(
          'KEYCLOAK_URL',
        )}/update-credential/session/${userSessionId}/send-code`,
        {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            length: 6,
            ttl: 300,
            clientId: clientId,
            method: otpType,
          }),
          method: 'POST',
        },
      );

      // Handle the error if necessary
      const data = await response.json();
      if (response.status !== 200) throw new Error(data.error);

      return data;
    } catch (error) {
      throw error;
    }
  }
}
