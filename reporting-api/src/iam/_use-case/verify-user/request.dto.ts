import { IsNotEmpty, IsString } from "@nestjs/class-validator";


export class VerifyUserRequestDto {
  @IsString()
  @IsNotEmpty()
  search: string;
}
