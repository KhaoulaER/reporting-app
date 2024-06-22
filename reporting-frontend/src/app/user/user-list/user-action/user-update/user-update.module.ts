import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserUpdateComponent } from './user-update.component';



@NgModule({
  declarations: [UserUpdateComponent],
  imports: [
    CommonModule
  ],
  exports: [
    UserUpdateComponent
  ]
})
export class UserUpdateModule { }
