import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialChangeComponent } from './layout/credential-change/credential-change.component';
import { AppTopBarComponent } from './layout/app.topbar.component';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CredentialChangeModule } from './layout/credential-change/credential-change.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    //AppTopBarComponent,
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CredentialChangeModule
  ]
})
export class SharedModule { }
