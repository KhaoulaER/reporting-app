import { Module } from '@nestjs/common';
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
    AuditModule
  ],
  controllers: [AppController],
  providers: [AppService, 
    KeycloakServiceModule
    ],
})
export class AppModule {}
