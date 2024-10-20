import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserDetailsComponent } from './modules/user/user-details/user-details.component';
import { UserAddComponent } from './modules/user/user-details/user-add/user-add.component';
import { HomeComponent } from './modules/home/home.component';

import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PanelModule } from 'primeng/panel';
import { MessageService, SharedModule } from 'primeng/api';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToolbarModule } from 'primeng/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserListComponent } from './modules/user/user-list/user-list.component';
import { RoleListComponent } from './modules/user/user-list/role-list/role-list.component';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './modules/clients/clients.component';
import { ProjetsComponent } from './modules/projets/projets.component';
import { AppLayoutModule } from './shared/layout/app.layout.module';
import { UserActionComponent } from './modules/user/user-list/user-action/user-action.component';
import { UserUpdateComponent } from './modules/user/user-list/user-action/user-update/user-update.component';
import { KeycloakAngularModule } from 'keycloak-angular';
import { NormesComponent } from './modules/normes/normes.component';

import { ClientsListComponent } from './modules/clients/clients-list/clients-list.component';
import { ClientsAddComponent } from './modules/clients/clients-add/clients-add.component';
import { ClientsUpdateComponent } from './modules/clients/clients-list/clients-action/clients-update/clients-update.component';
import { ProjetAuditComponent } from './modules/projet-audit/projet-audit.component';
import { ProjetAuditListComponent } from './modules/projet-audit/projet-audit-list/projet-audit-list.component';
import { NormeAdopteComponent } from './modules/projet-audit/norme-adopte/norme-adopte.component';
import { NormeAdopteListComponent } from './modules/projet-audit/norme-adopte/norme-adopte-list/norme-adopte-list.component';
import { AuditComponent } from './modules/audit/audit.component';
import { PreuveAuditComponent } from './modules/audit/preuve-audit/preuve-audit.component';
import { AuditValidationComponent } from './modules/audit/audit-validation/audit-validation.component';
import { RapportComponent } from './modules/rapport/rapport.component';
import { AuditHeadComponent } from './modules/audit/audit-head/audit-head.component';
import { ConformiteComponent } from './modules/audit/conformite/conformite.component';
import { PcAuditComponent } from './modules/audit/pc-audit/pc-audit.component';
import { ProjetAddComponent } from './modules/projets/projet-add/projet-add.component';
import { ProjetListComponent } from './modules/projets/projet-list/projet-list.component';
import { ProjetNormeComponent } from './modules/projets/projet-list/projet-norme/projet-norme.component';
import { AffectationComponent } from './modules/projets/affectation/affectation.component';
import { AffectationAddComponent } from './modules/projets/affectation/affectation-add/affectation-add.component';
import { TestPromptComponent } from './modules/test-prompt/test-prompt.component';
import { RecommendationComponent } from './modules/audit/recommendation/recommendation.component';
import { ChartModule } from 'primeng/chart';
import { AuthInterceptor } from './core/auth.interceptor';
import { CredentialChangeComponent } from './shared/layout/credential-change/credential-change.component';
import { HomeManagerComponent } from './modules/home-manager/home-manager.component';
import { ProjectListComponent } from './modules/home-manager/project-list/project-list.component';
import { AuditListComponent } from './modules/home-manager/audit-list/audit-list.component';
import { HomeAuditorComponent } from './modules/home-auditor/home-auditor.component';
import { ChapitreAddComponent } from './modules/normes/chapitre/chapitre-details/chapitre-add/chapitre-add.component';
import { ChapitreDetailsComponent } from './modules/normes/chapitre/chapitre-details/chapitre-details.component';
import { ChapitreUpdateComponent } from './modules/normes/chapitre/chapitre-list/chapitre-action/chapitre-update/chapitre-update.component';
import { ChapitreListComponent } from './modules/normes/chapitre/chapitre-list/chapitre-list.component';
import { ChapitreComponent } from './modules/normes/chapitre/chapitre.component';
import { PointsControleAddComponent } from './modules/normes/chapitre/points-controle/points-controle-details/points-controle-add/points-controle-add.component';
import { PointsControleListComponent } from './modules/normes/chapitre/points-controle/points-controle-list/points-controle-list.component';
import { PointsControleUpdateComponent } from './modules/normes/chapitre/points-controle/points-controle-list/points-controle-uaction/points-controle-update/points-controle-update.component';
import { PointsControleComponent } from './modules/normes/chapitre/points-controle/points-controle.component';
import { PreuveAddComponent } from './modules/normes/chapitre/points-controle/preuve/preuve-add/preuve-add.component';
import { PreuveListComponent } from './modules/normes/chapitre/points-controle/preuve/preuve-list/preuve-list.component';
import { PreuveComponent } from './modules/normes/chapitre/points-controle/preuve/preuve.component';
import { NormeAddComponent } from './modules/normes/norme-details/norme-add/norme-add.component';
import { NormeDetailsComponent } from './modules/normes/norme-details/norme-details.component';
import { NormeUpdateComponent } from './modules/normes/norme-list/norme-action/norme-update/norme-update.component';
import { NormeListComponent } from './modules/normes/norme-list/norme-list.component';
import { LoginComponent } from './core/authentication/login/login.component';
import { AuditVerifyComponent } from './modules/home-manager/audit-list/audit-verify/audit-verify.component';
import { UnauditedProComponent } from './modules/home-auditor/unaudited-pro/unaudited-pro.component';
import { RapportWordComponent } from './modules/rapport/rapport-word/rapport-word.component';
//import { AuthInterceptor } from './core/auth.interceptor';
//import { AuthInterceptor } from './core/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    UserDetailsComponent,
    UserAddComponent,
    HomeComponent,
    UserListComponent,
    RoleListComponent,
    LoginComponent,
    ClientsComponent,
    ProjetsComponent,
    UserActionComponent,
    UserUpdateComponent,
    NormesComponent,
    NormeDetailsComponent,
    NormeListComponent,
    NormeAddComponent,
    ChapitreComponent,
    ChapitreListComponent,
    ChapitreDetailsComponent,
    ChapitreAddComponent,
    NormeUpdateComponent,
    ChapitreUpdateComponent,
    PointsControleComponent,
    PointsControleAddComponent,
    PointsControleListComponent,
    PointsControleUpdateComponent,
    PreuveComponent,
    PreuveListComponent,
    PreuveAddComponent,
    ClientsListComponent,
    ClientsAddComponent,
    ClientsUpdateComponent,
    ProjetAuditComponent,
    ProjetAuditListComponent,
    NormeAdopteComponent,
    NormeAdopteListComponent,
    AuditComponent,
    PreuveAuditComponent,
    AuditValidationComponent,
    RapportComponent,
    AuditHeadComponent,
    ConformiteComponent,
    PcAuditComponent,
    ProjetAddComponent,
    ProjetListComponent,
    ProjetNormeComponent,
    AffectationComponent,
    AffectationAddComponent,
    TestPromptComponent,
    RecommendationComponent,
    HomeManagerComponent,
    ProjectListComponent,
    AuditListComponent,
    HomeAuditorComponent,
    AuditVerifyComponent,
    UnauditedProComponent,
    RapportWordComponent,
   // CredentialChangeComponent
     ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    ToastModule,
    InputTextareaModule,
    ConfirmDialogModule,
    BrowserAnimationsModule,
    SelectButtonModule,
    PanelModule,
    FileUploadModule,
    PasswordModule,
    CheckboxModule,
    TableModule,
    SidebarModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    ToolbarModule,
    DialogModule,
    FormsModule,
    AppLayoutModule,
    KeycloakAngularModule,
    ChartModule,
    SharedModule
  ],
  providers: [
    provideClientHydration(),
    MessageService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
