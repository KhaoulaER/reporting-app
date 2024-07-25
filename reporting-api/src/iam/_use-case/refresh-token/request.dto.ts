import { IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator";

export class RefreshTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
  @IsString()
  @IsOptional()
  applicationid?: string;
  @IsString()
  @IsOptional()
  clientSecret?: string;
  @IsString()
  @IsOptional()
  redirect_uri?: string;
}
