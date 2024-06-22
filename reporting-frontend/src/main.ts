import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
