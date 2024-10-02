import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class KeycloakService {
 /* private kcAdminClient: any;

  constructor() {
    this.initializeKeycloakClient();
  }

  private async initializeKeycloakClient() {
    const KcAdminClient = (await import('@keycloak/keycloak-admin-client')).default;
    this.kcAdminClient = new KcAdminClient({
      baseUrl: 'http://localhost:8080/auth',
      realmName: 'grc-realm',
    });

    // Configurez l'authentification du client admin
    await this.kcAdminClient.auth({
      username: 'admin',
      password: '12345678',
      grantType: 'password',
      clientId: 'admin-cli',
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    if (!this.kcAdminClient) {
      await this.initializeKeycloakClient();
    }
    return this.kcAdminClient.users.create({
      username: createUserDto.email,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      enabled: true,
      credentials: [
        {
          type: 'password',
          value: createUserDto.password,
          temporary: false,
        },
      ],
    });
  }*/
}
