import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import KcAdminClient from '@keycloak/keycloak-admin-client';

const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();

@Injectable()
export class ConnexionKeycloakService {
  public adminClient: KcAdminClient;
  constructor(private serviceConfig: ConfigService) {
    this.connection().then((admin) => {
      this.adminClient = admin;
    });
    setInterval(() => {
      this.connection().then((admin) => {
        this.adminClient = admin;
      });
    }, 30 * 1000);
  }
  public async connection(realm?: string) {
   
    const kcAdminClient = new (
      await dynamicImport('@keycloak/keycloak-admin-client')
    ).default({
      baseUrl: this.serviceConfig.get('KEYCLOAK_BASE_URL'),
      realmName: this.serviceConfig.get('KEYCLOAK_ADMIN_REALM'),
    });
    await kcAdminClient.auth({
      grantType: this.serviceConfig.get('KEYCLOAK_GRANT_TYPE'),
      clientId: this.serviceConfig.get('KEYCLOAK_ADMIN_CLIENT_ID'),
      username: this.serviceConfig.get('KEYCLOAK_USERNAME'),
      password: this.serviceConfig.get('KEYCLOAK_PASSWORD'),
    });
    if (realm) {
      console.log("realm done", realm);
      kcAdminClient.setConfig({
        realmName: realm,
      });
    }
    return kcAdminClient;
  }
}
