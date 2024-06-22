import { Role } from "../entities/user.entity"

export class CreateUserDto {
    readonly id:string
    readonly firstName:string
    readonly lastName:string
    readonly email:string
    readonly password:string
    readonly phone:string
    readonly role:Role
     photo:string
}
