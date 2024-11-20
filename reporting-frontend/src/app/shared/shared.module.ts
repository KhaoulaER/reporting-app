import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialChangeComponent } from './layout/credential-change/credential-change.component';
import { AppTopBarComponent } from './layout/app.topbar.component';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CredentialChangeModule } from './layout/credential-change/credential-change.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { AuthenticationModule } from '../core/authentication/authentication.module';

// Required for AOT compilation (Ahead Of Time)
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppTopBarComponent,
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CredentialChangeModule,
    ConfirmDialogModule,
    ToastModule,
    AuthenticationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    AppTopBarComponent  // Also export it so it can be used in other modules
  ]
})
export class SharedModule { }
