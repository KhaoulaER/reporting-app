import { IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator";

export class UpdatePasswordRequestDto {
  @IsOptional()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
