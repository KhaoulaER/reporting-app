import { IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator";

export class ValidateTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  token: string;
  @IsString()
  @IsOptional()
  client_id: string;
  @IsString()
  @IsOptional()
  client_secret: string;
}
