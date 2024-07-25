import { Module } from '@nestjs/common';
import { ConnexionKeycloakService } from './connexion-keycloak.service';

@Module({
  providers: [ConnexionKeycloakService],
  exports: [ConnexionKeycloakService],
})
export class KeycloakServiceModule {}
