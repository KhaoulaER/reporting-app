import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { UserDetailsComponent } from './modules/user/user-details/user-details.component';
import { UserAddComponent } from './modules/user/user-details/user-add/user-add.component';
import { UserListComponent } from './modules/user/user-list/user-list.component';
import { ClientsComponent } from './modules/clients/clients.component';
import { ProjetsComponent } from './modules/projets/projets.component';
import { AppLayoutComponent } from './shared/layout/app.layout.component';
import { Role } from './modules/user/model/user';
import { ClientsListComponent } from './modules/clients/clients-list/clients-list.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProjetAuditListComponent } from './modules/projet-audit/projet-audit-list/projet-audit-list.component';
import { ProjetAuditComponent } from './modules/projet-audit/projet-audit.component';
import { AuditComponent } from './modules/audit/audit.component';
import { TestPromptComponent } from './modules/test-prompt/test-prompt.component';
import { authGroupGuardGuard } from './core/guards/auth-group-guard.guard';
import { HomeManagerComponent } from './modules/home-manager/home-manager.component';
import { HomeAuditorComponent } from './modules/home-auditor/home-auditor.component';
import { NormeListComponent } from './modules/normes/norme-list/norme-list.component';
import { ChapitreListComponent } from './modules/normes/chapitre/chapitre-list/chapitre-list.component';
import { RoleGuard } from './core/guards/role.guard';
import { PointsControleListComponent } from './modules/normes/chapitre/points-controle/points-controle-list/points-controle-list.component';
import { RapportComponent } from './modules/rapport/rapport.component';



const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent ,
    canActivate: [AuthGuard],
    children: [
        {
          path: 'admin',
          canActivate: [RoleGuard],data: { roles: ['admin']},
          /*loadChildren: () =>
            import('./modules/admin/admin.module').then((m) => m.AdminModule),
          canActivate: [RoleGuard],*/

          children:[
            {path: "", component: UserAddComponent},
            {path: "users/:role", component: UserListComponent},
            {path: "norms", component: NormeListComponent},
            {path: "chapitre/:normeId", component: ChapitreListComponent},
            {path: "pc/:chapitreId", component:PointsControleListComponent}
          ]
          //data: { roles: ['admin'] }
        },
        {
          path: 'home-auditor',
          canActivate: [RoleGuard],data: { roles: ['auditor']},
          /*loadChildren: () =>
            import('./modules/admin/admin.module').then((m) => m.AdminModule),
          canActivate: [RoleGuard],*/

          children:[
            {path: "", component: HomeAuditorComponent},
            {path: "projets-audit", component: ProjetAuditListComponent},
            { path: 'audit/:normeId', component: AuditComponent },
            {path: "rapport", component:RapportComponent}
          ]
          //data: { roles: ['admin'] }
        },
        {
          path: 'home-manager',
          canActivate: [RoleGuard],data: { roles: ['manager']},
          /*loadChildren: () =>
            import('./modules/admin/admin.module').then((m) => m.AdminModule),
          canActivate: [RoleGuard],*/

          children:[
            {path: "", component: HomeManagerComponent},
            {path: "clients", component: ClientsListComponent},
            {path: "audit-manager/:normeId", component:AuditComponent},
            {path: "projects/:managerId", component: ProjetsComponent},
            {path: "rapport", component:RapportComponent}
          ]
          //data: { roles: ['admin'] }
        },
       /* {
          path: 'client',
          loadChildren: () =>
            import('./modules/client/client.module').then((m) => m.ClientModule),
          canActivate: [RoleGuard],
          data: { roles: ['client'] }
        },
        {
          path: 'prestataire',
          loadChildren: () =>
            import('./modules/prestataire/prestataire.module').then((m) => m.PrestataireModule),
          canActivate: [RoleGuard],
          data: { roles: ['pentester', 'manager'] }
        },
        {
          path: 'notifications',
          component: NotificationComponent,
        },*/

    ]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/authentication/authentication.module').then((m) => m.AuthenticationModule),
  },
  // { path: 'notfound', loadChildren: () => import('./shared/notfound/notfound.module').then(m => m.NotfoundModule) },
  //  {
  //   path: '**',
  //   redirectTo: '/auth/login',
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
