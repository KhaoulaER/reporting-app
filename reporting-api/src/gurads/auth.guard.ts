import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { jwtDecode, JwtDecodeOptions } from 'jwt-decode';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    
    console.log('Authorization Header:', authHeader); // Log for debugging

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      // Validate the token with Keycloak first
      const userInfo = await this.validateToken(token);

      if (!userInfo) {
        throw new UnauthorizedException('Token validation failed');
      }

      // Decode the token AFTER validating it
      const decodedToken = jwtDecode(token);

      // Ensure 'resource_access' and 'roles' are available in the decoded token
      const clientID = process.env.KEYCLOAK_CLIENT_ID;
      const roles = decodedToken['resource_access']?.[clientID]?.roles;

      if (!roles) {
        throw new UnauthorizedException('Roles not found in token');
      }

      // Attach user and roles to the request object
      request.user = {
        ...userInfo,  // Info from Keycloak validation (userinfo endpoint)
        ...decodedToken,  // Decoded token contents
        roles,  // Extracted roles
      };

      console.log('Authenticated user:', request.user); // Log the user info

      return true;
    } catch (error) {
      console.error('Error during token validation:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Validate token with Keycloak userinfo endpoint
  private async validateToken(token: string): Promise<any> {
    const response = await fetch(
      `${this.configService.get('KEYCLOAK_URL')}/protocol/openid-connect/userinfo`, 
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const responseBody = await response.text();
    
    if (response.status !== 200) {
      throw new UnauthorizedException(`Invalid or expired token. Keycloak responded with status ${response.status}`);
    }

    return JSON.parse(responseBody);  // Return the parsed user info
  }


}
