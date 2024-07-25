import { IsString, IsNotEmpty, IsEnum } from "@nestjs/class-validator";
import { OtpType, OtpTypeEnum } from '../../_business/authentification.model';

export class SendResetRequestDto {
  @IsString()
  @IsNotEmpty()
  userSessionId: string;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsEnum(OtpTypeEnum)
  @IsNotEmpty()
  otpType: OtpType;
}
