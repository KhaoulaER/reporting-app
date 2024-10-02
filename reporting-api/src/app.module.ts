import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloakConnectModule } from 'nest-keycloak-connect'; 
import { DatabaseModule } from './database/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { NormesModule } from './normes/normes.module';
//import { CoreModule } from './core/core.module';
import { ClientsModule } from './clients/clients.module';
//import { KeycloakModule } from './core/keycloak/keycloak.module';
import { KeycloakServiceModule } from './keycloak.module';
import { IamModule } from './iam/iam.module';
import { SharedModule } from './shared/shared.module';
import { ProjetsModule } from './projets/projets.module';
import { AffectationModule } from './affectation/affectation.module';
import { AuditModule } from './audit/audit.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './gurads/roles.guard';
import { AuthGuard } from './gurads/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthenticationService } from './iam/_business/authentification.service';
import { AuthInterceptor } from './iam/interceptor/auth.interceptor';
import { AuditService } from './audit/_business/audit.service';

const keyCloakOptionsProvider = {
  provide: 'keyCloakDataProvider',
  useFactory: (config: ConfigService) => {
    return {
      authServerUrl: config.get('KEYCLOAK_BASE_URL'),
      realm: config.get('KEYCLOAK_REALM'),
      clientId: config.get('KEYCLOAK_CLIENT_ID'),
      secret: config.get('KEYCLOAK_CLIENT_SECRET'),
    };
  },
  inject: [ConfigService],
};
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true}),
    UsersModule, 
    NormesModule,
    ClientsModule,
    KeycloakConnectModule.registerAsync(keyCloakOptionsProvider),
    IamModule,
    SharedModule,
    ProjetsModule,
    AffectationModule,
    AuditModule,
  
  ],
  controllers: [AppController],
  providers: [AppService, 
    AuthGuard,
    RolesGuard,
    //vJwtService,
    
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
    ],
})
export class AppModule {}
