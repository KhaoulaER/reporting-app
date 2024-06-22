import { KeycloakConnectOptions } from "nest-keycloak-connect"; 

export const keycloakConfig: KeycloakConnectOptions = {
  authServerUrl: 'http://localhost:8080/auth',
  realm: 'grc-realm',
  clientId: 'grc-client-id',
  secret: '',
};
