import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { UserAddComponent } from './user/user-details/user-add/user-add.component';
import { HomeComponent } from './home/home.component';

import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Toolbar, ToolbarModule } from 'primeng/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserListComponent } from './user/user-list/user-list.component';
import { RoleListComponent } from './user/user-list/role-list/role-list.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './core/login/login.component'; 
import { ClientsComponent } from './clients/clients.component';
import { ProjetsComponent } from './projets/projets.component';
import { AppLayoutModule } from './shared/layout/app.layout.module';
import { UserActionComponent } from './user/user-list/user-action/user-action.component';
import { UserUpdateComponent } from './user/user-list/user-action/user-update/user-update.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { NormesComponent } from './normes/normes.component';
import { NormeDetailsComponent } from './normes/norme-details/norme-details.component';
import { NormeListComponent } from './normes/norme-list/norme-list.component';
import { NormeAddComponent } from './normes/norme-details/norme-add/norme-add.component';
import { ChapitreComponent } from './normes/chapitre/chapitre.component';
import { ChapitreListComponent } from './normes/chapitre/chapitre-list/chapitre-list.component';
import { ChapitreDetailsComponent } from './normes/chapitre/chapitre-details/chapitre-details.component';
import { ChapitreAddComponent } from './normes/chapitre/chapitre-details/chapitre-add/chapitre-add.component';
import { NormeUpdateComponent } from './normes/norme-list/norme-action/norme-update/norme-update.component';
import { ChapitreUpdateComponent } from './normes/chapitre/chapitre-list/chapitre-action/chapitre-update/chapitre-update.component';
import { PointsControleComponent } from './normes/chapitre/points-controle/points-controle.component';
import { PointsControleAddComponent } from './normes/chapitre/points-controle/points-controle-details/points-controle-add/points-controle-add.component';
import { PointsControleListComponent } from './normes/chapitre/points-controle/points-controle-list/points-controle-list.component';
import { PointsControleUpdateComponent } from './normes/chapitre/points-controle/points-controle-list/points-controle-uaction/points-controle-update/points-controle-update.component';
import { PreuveComponent } from './normes/chapitre/points-controle/preuve/preuve.component';
import { PreuveListComponent } from './normes/chapitre/points-controle/preuve/preuve-list/preuve-list.component';
import { PreuveAddComponent } from './normes/chapitre/points-controle/preuve/preuve-add/preuve-add.component';
import { ClientsListComponent } from './clients/clients-list/clients-list.component';
import { ClientsAddComponent } from './clients/clients-add/clients-add.component';
import { ClientsUpdateComponent } from './clients/clients-list/clients-action/clients-update/clients-update.component';
import { ProjetAuditComponent } from './projet-audit/projet-audit.component';
import { ProjetAuditListComponent } from './projet-audit/projet-audit-list/projet-audit-list.component';
import { NormeAdopteComponent } from './projet-audit/norme-adopte/norme-adopte.component';
import { NormeAdopteListComponent } from './projet-audit/norme-adopte/norme-adopte-list/norme-adopte-list.component';
import { AuditComponent } from './audit/audit.component';
import { PreuveAuditComponent } from './audit/preuve-audit/preuve-audit.component';
import { AuditValidationComponent } from './audit/audit-validation/audit-validation.component';
import { RapportComponent } from './rapport/rapport.component';
import { AuditHeadComponent } from './audit/audit-head/audit-head.component';
import { ConformiteComponent } from './audit/conformite/conformite.component';
import { PcAuditComponent } from './audit/pc-audit/pc-audit.component';
import { ProjetAddComponent } from './projets/projet-add/projet-add.component';
import { ProjetListComponent } from './projets/projet-list/projet-list.component';
import { ProjetNormeComponent } from './projets/projet-list/projet-norme/projet-norme.component';
import { AffectationComponent } from './projets/affectation/affectation.component';
import { AffectationAddComponent } from './projets/affectation/affectation-add/affectation-add.component';



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
    AffectationAddComponent
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
    KeycloakAngularModule
  ],
  providers: [
    provideClientHydration(),
    MessageService,
    ConfirmationService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
