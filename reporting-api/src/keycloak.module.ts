import { forwardRef, Module } from '@nestjs/common';
import { ConnexionKeycloakService } from './connexion-keycloak.service';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [ConnexionKeycloakService,
    JwtService, 
    
  ],
  exports: [ConnexionKeycloakService],
})
export class KeycloakServiceModule {}
