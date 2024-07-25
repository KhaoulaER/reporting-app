import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class LogInRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
