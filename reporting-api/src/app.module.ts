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
import { keycloakConfig } from './core/keycloak.config';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true}),
    UsersModule, 
    NormesModule,
    ClientsModule,
    KeycloakConnectModule.register(keycloakConfig)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
