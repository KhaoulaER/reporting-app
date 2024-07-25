export interface Login {
  username: string;
  password: string;
  rememberMe?: string;
}

export interface IError {
  code: string;
  message: string;
  error?: any;
}

export declare abstract class CustomError implements IError {
  code: string;
  message: string;
  error?: any;
  constructor(code: string, message: string, error?: any);
  protected toString(): string;
}

export interface IValidateToken {
  token: string;
  client_id: string;
  client_secret: string;
}

export class RefreshTokenRequest {
  refresh_token: string;
  applicationid?: string;
  clientSecret?: string;
  redirect_uri?: string;
}

export interface LogOutRequest {
  refresh_token: string;
  applicationid?: string;
  clientSecret?: string;
}

export interface UpdatePassword {
  token: string;
  newPassword: string;
}

export enum OtpTypeEnum {
  OTP_EMAIL = 'OTP_EMAIL',
  OTP_SMS = 'OTP_SMS',
}
export type OtpType = OtpTypeEnum.OTP_EMAIL | OtpTypeEnum.OTP_SMS;
