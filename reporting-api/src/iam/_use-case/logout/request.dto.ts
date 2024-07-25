import { IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator";

export class LogOutRequestDto {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
  @IsString()
  @IsOptional()
  applicationid: string;
  @IsString()
  @IsOptional()
  clientSecret: string;
}
