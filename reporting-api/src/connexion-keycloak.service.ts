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
  private async getAccessToken(): Promise<string> {
    const kcAdminClient = new (
      await dynamicImport('@keycloak/keycloak-admin-client')
    ).default({
      baseUrl: this.serviceConfig.get('KEYCLOAK_BASE_URL'),
      realmName: this.serviceConfig.get('KEYCLOAK_ADMIN_REALM'),
    });
   // Obtenir le token d'accès
   const accessToken = await this.getAccessToken();

   // Ajouter le token d'accès aux en-têtes de toutes les requêtes Keycloak
   kcAdminClient.setAccessToken(accessToken);
    const response = await kcAdminClient.auth({
      grantType: this.serviceConfig.get('KEYCLOAK_GRANT_TYPE'),
      clientId: this.serviceConfig.get('KEYCLOAK_ADMIN_CLIENT_ID'),
      username: this.serviceConfig.get('KEYCLOAK_USERNAME'),
      password: this.serviceConfig.get('KEYCLOAK_PASSWORD'),
    });
  
    return response.access_token;
  }

  public async assignRoleToAuditor(userId: string, projectId: string, role: 'read-only' | 'read-write') {
    const kcAdminClient = await this.connection();
    const clientId = this.serviceConfig.get('KEYCLOAK_CLIENT_ID');
    const realm = this.serviceConfig.get('KEYCLOAK_REALM');
    const roleName = `project-${projectId}-${role}`;

    // Find the role
    const roles = await kcAdminClient.roles.find({ realm });
    const roleToAssign = roles.find(r => r.name === roleName);
    console.log('ROLE TO ASSIGN: ', roleToAssign)

    if (roleToAssign) {
      // Assign role to auditor
      await kcAdminClient.users.addRealmRoleMappings({
        id: userId,
        realm,
        clientId,
        roles: [roleToAssign]
      });
    } else {
      throw new Error(`Role ${roleName} not found`);
    }
  }

    // Fetch the user's role for a specific project
    async getUserRoleForProject(userId: string, projectId: string): Promise<string> {
      const keycloakAdmin = await this.adminClient;
      const realm = this.serviceConfig.get('KEYCLOAK_REALM');
  
      // Logic to retrieve user's current role for the project
      // (Assumes roles are named like: 'project-xxxxxx-read-only' or 'project-xxxxxx-read-write')
      const userRoles = await keycloakAdmin.users.listRealmRoleMappings({ id: userId, realm });
      const roleForProject = userRoles.find(role => role.name.startsWith(`project-${projectId}`));
  
      if (roleForProject) {
        return roleForProject.name.endsWith('read-only') ? 'read-only' : 'read-write';
      }
  
      return null;
    }
  
    // Remove role from user
    async removeRoleFromUser(userId: string, projectId: string, role: string): Promise<void> {
      const keycloakAdmin = await this.adminClient;
      const realm = this.serviceConfig.get('KEYCLOAK_REALM');
      
      const roleToRemove = await keycloakAdmin.roles.findOneByName({
        name: `project-${projectId}-${role}`,
        realm,
      });
  
      if (roleToRemove) {
        await keycloakAdmin.users.delRealmRoleMappings({
          id: userId,
          roles: [{ id: roleToRemove.id, name: roleToRemove.name }],
          realm,
        });
      }
    }
}
