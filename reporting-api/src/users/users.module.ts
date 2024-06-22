import { Module } from '@nestjs/common';
import { UsersService } from './_business/users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
///import { KeycloakModule } from 'src/core/auth/keycloak/keycloak.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
   // KeycloakModule
],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
