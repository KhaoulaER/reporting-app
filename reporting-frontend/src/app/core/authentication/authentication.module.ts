import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication.routing';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule
  ],
  exports: [ // Add this line to export LogoutComponent
    LogoutComponent
  ]
})
export class AuthenticationModule { }
