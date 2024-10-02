import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [AuthGuard],
    component: LoginComponent,
  },
  // {
  //   path: 'callback',
  //   component: CallbackComponent,
  // },
 /* {
    path: 'logout',
    component: LogoutComponent,
  },*/
  // {
  //   path: 'reset-password',
  //   loadChildren: () =>
  //     import('../authentication/reset-password/reset-password.module').then(
  //       (mo) => mo.ResetPasswordModule
  //     ),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }