import { Role } from "../entities/user.entity"

export class CreateUserDto {
    readonly id:string
    readonly firstName:string
    readonly lastName:string
    readonly email:string
    readonly password:string
    readonly phone:string
    readonly role:Role
}
export interface KeycloakUserDto {
    password: string
    email: string;
    firstName: string;
    lastName: string;
    credentials: {
      type: string;
      value: string;
      temporary: boolean;
    }[];
    enabled: boolean;
    attributes?: Record<string, string[]>;
    groups?: string[];
    username: string;
  }