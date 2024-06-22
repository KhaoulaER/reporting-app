import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { PanelModule } from 'primeng/panel';
import { UserDetailsComponent } from '../user/user-details/user-details.component';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    PanelModule,
  ],
  exports:[
    HomeComponent
  ]
})
export class HomeModule { }
