import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { UserAddComponent } from './user/user-details/user-add/user-add.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { LoginComponent } from './login/login.component'; 
import { ClientsComponent } from './clients/clients.component';
import { ProjetsComponent } from './projets/projets.component';
import { AppLayoutComponent } from './shared/layout/app.layout.component';
import { Role } from './user/model/user';
import { NormeListComponent } from './normes/norme-list/norme-list.component';
import { ChapitreListComponent } from './normes/chapitre/chapitre-list/chapitre-list.component';
import { PointsControleListComponent } from './normes/chapitre/points-controle/points-controle-list/points-controle-list.component';
import { ClientsListComponent } from './clients/clients-list/clients-list.component';

const routes: Routes = [
  /*{
    path: 'admin-dashboard',
    component: HomeComponent,
    canActivate: [AuthGaurd],
    data: { roles: [Role.ADMIN] } // Données spécifiques à la route
  },
  {
    path: 'auditor-dashboard',
    component: ProjetsComponent,
    canActivate: [AuthGaurd],
    data: { roles: [Role.AUDITOR] } // Données spécifiques à la route
  },
  {
    path: 'project-manager-dashboard',
    component: ClientsComponent,
    canActivate: [AuthGaurd],
    data: { roles: [Role.PROJECT_MANAGER] } // Données spécifiques à la route
  },*/
  {path: "", component: LoginComponent},
  {path: "home-admin", component: AppLayoutComponent,children:[
    {path: "", component: HomeComponent},
    {path:"clients",component:ClientsListComponent},
    {path: "users", component: UserListComponent},
    {path: "users/:role", component: UserListComponent},
    {path: "norms", component: NormeListComponent},
    {path: "chapitre/:normeId", component: ChapitreListComponent},
    {path: "pc/:chapitreId", component:PointsControleListComponent}
  ]},
  {path: "home-manager", component: AppLayoutComponent, children:[
    {path: "clients", component: ClientsListComponent},
    {path: "", component: ProjetsComponent},
  ]}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
