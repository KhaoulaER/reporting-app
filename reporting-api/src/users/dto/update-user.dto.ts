import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Role } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    readonly firstName:string
    readonly lastName:string
    readonly email:string
    readonly phone:string
}
