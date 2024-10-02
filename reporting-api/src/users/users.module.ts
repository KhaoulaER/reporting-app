import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './_business/users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { KeycloakService } from 'src/iam/_business/keycloak/keycloak/keycloak.service';
import { ConnexionKeycloakService } from 'src/connexion-keycloak.service';
import { KeycloakServiceModule } from 'src/keycloak.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuditModule } from 'src/audit/audit.module';
///import { KeycloakModule } from 'src/core/auth/keycloak/keycloak.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => KeycloakServiceModule),
    AuditModule
],
  controllers: [UsersController],
  providers: [UsersService,/*KeycloakService*/],
  exports: [UsersService]
})
export class UsersModule {}
