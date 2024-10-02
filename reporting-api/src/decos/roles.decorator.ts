import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/entities/user.entity';

export const ROLES_KEY='roles';
export const GROUPS_KEY='groups';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
export const Groups = (...groups:string[])=> SetMetadata(GROUPS_KEY,groups);