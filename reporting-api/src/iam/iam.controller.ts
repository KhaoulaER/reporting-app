import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
//import { Response } from 'express';
import { LogInUseCase } from './_use-case/login/login.use-case';
import { GetPasswordPolicyUseCase } from './_use-case/get-password-policy/get-password-policy_case';
import { LogInRequestDto } from './_use-case/login/request.dto';
// import { LogOutUseCase } from './_use-case/logout/logout-use_case';
// import { LogOutRequestDto } from './_use-case/logout/request.dto';
import { RefreshTokenUseCase } from './_use-case/refresh-token/refreshtoken-use_case';
import { RefreshTokenRequestDto } from './_use-case/refresh-token/request.dto';
import { SendResetRequestDto } from './_use-case/send-reset-code/request.dto';
import { SendResetCodeUseCase } from './_use-case/send-reset-code/send-code.use-case';
import { UpdatePasswordRequestDto } from './_use-case/update-password/request.dto';
import { UpdatePasswordUseCase } from './_use-case/update-password/update-password_case';
import { ValidateTokenRequestDto } from './_use-case/validate-token/request.dto';
import { ValidateTokenoUseCase } from './_use-case/validate-token/validate-token_use-case';
import { VerifyUserRequestDto } from './_use-case/verify-user/request.dto';
import { VerifyUserUseCase } from './_use-case/verify-user/verify-code.use-case';
import {  Public } from 'nest-keycloak-connect';
import { Response } from 'express';
import { LogOutRequestDto } from './_use-case/logout/request.dto';
import { LogOutUseCase } from './_use-case/logout/logout-use_case';
import { AuthenticatedUser } from './authenticated-user.decorator';

@Controller('auth')
export class IamController {
  constructor(
    private logInUseCase: LogInUseCase,
    private validateTokenoUseCase: ValidateTokenoUseCase,
    // private logOutUseCase: LogOutUseCase,
    private getPasswordPolicyUseCase: GetPasswordPolicyUseCase,
    private updatePasswordUseCase: UpdatePasswordUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private verifyUserUseCase: VerifyUserUseCase,
    private sendResetCodeUseCase: SendResetCodeUseCase,
    private logOutUseCase:LogOutUseCase
  ) {}

  @Post('login')
  @Public()
  async login(@Body() input: LogInRequestDto, @Res({ passthrough: true }) res: Response) {
    return this.logInUseCase.run(input);
    /*const result = await this.logInUseCase.run(input);

    // Set HttpOnly cookies
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      //sameSite: 'Strict', // Adjust based on your security needs
    });
    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      //sameSite: 'Strict', // Adjust based on your security needs
    });

    return result;*/
  }
 

   @Post('logout')
   @HttpCode(204)
   @Public()
   logout(@Body() token: LogOutRequestDto, /*@AuthenticatedUser() user: any*/ @Req() req:any) {
    console.log('Authenticated user:', req.user.keycloakId);  // Add this line for debugging
    if (!req.user.keycloakId) {
      throw new Error('User is not authenticated');
    }
    return this.logOutUseCase.run({ body: token, id: req.user['sub'] });
  }

  @Post('TokenValidation')
  @Public()
  validateToken(@Body() tokenVallidationbject: ValidateTokenRequestDto) {
    return this.validateTokenoUseCase.run(tokenVallidationbject);
  }

  @Post('refreshToken')
  @Public()
  refreshAccessToken(@Body() token: RefreshTokenRequestDto) {
    return this.refreshTokenUseCase.run(token);
  }

  @Get('isAuthenticated')
  isAuthenticated() {
    return { isAuthenticated: true };
  }

  @Get('passwordPolicy')
  @Public()
  public async getRealmPasswordPolicy() {
    return this.getPasswordPolicyUseCase.run();
  }

  @Put('updatePassword')
  public async updatePassword(
    @Req() req,
    @Body() data: UpdatePasswordRequestDto,
  ) {
    console.log('req', req);
    const authorizationHeader = req.headers.authorization;
    const token: string = authorizationHeader.split(' ')[1];
    return this.updatePasswordUseCase.run({
      token,
      newPassword: data.newPassword,
    });
  }

  @Get('reset-password/verify-user')
  @Public()
  async verifyUser(@Query('search') search: string) {
    const requestDto: VerifyUserRequestDto = { search };
    return await this.verifyUserUseCase.run(requestDto);
  }

  @Post('reset-password/send-reset-code')
  @Public()
  async sendCodeForReset(@Body() sendResetRequestDto: SendResetRequestDto) {
    return this.sendResetCodeUseCase.run(sendResetRequestDto);
  }
}
