import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialChangeComponent } from './credential-change.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Dialog, DialogModule } from 'primeng/dialog';



@NgModule({
  declarations: [
    CredentialChangeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule
  ],
  exports: [
    CredentialChangeComponent
  ]
})
export class CredentialChangeModule { }
