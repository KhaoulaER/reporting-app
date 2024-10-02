import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from '../../../shared/layout/service/app.layout.service';
import { AuthenticationService } from '../authentication.service';
import { RoleService } from '../../services/role.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit{

    valCheck: string[] = ['remember'];

    username!: string;
    password!: string;

    loginFormGroup!: FormGroup;
    errorMessage!:string;

    constructor(
      public layoutService: LayoutService, 
      private keycloakService: KeycloakService, 
      private http:HttpClient, 
      private router:Router,
      private fb:FormBuilder,
      private authenticationService:AuthenticationService,
      private messageService:MessageService,
      private roleService: RoleService
    ) { }
  ngOnInit(): void {
    this.loginFormGroup=this.fb.group({
      username: this.fb.control(""),
      password: this.fb.control("")
    })
  }
 
  handleLogin(): void {
    const { username, password } = this.loginFormGroup.value;

    this.authenticationService.login(username, password).subscribe({
      next: (response) => {
        const authUser = this.authenticationService.getAuthenticatedUser();
        if (authUser) {
          this.redirectUserByRole(authUser.groups);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vous êtes connecté' });
        } else {
          console.error('User authentication failed');
          this.errorMessage = "Erreur d'authentification.";
        }
      },
      error: (loginError) => {
        console.error('Login error:', loginError);
        this.errorMessage = "Login échoué, vérifiez vos identifiants.";
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Login échoué' });
      },
    });
  }
  redirectUserByRole(role: string) {
    if (this.roleService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.roleService.isManager()) {
      this.router.navigate(['/home-manager']);
    } else if (this.roleService.isAuditor()) {
      this.router.navigate(['/home-auditor']);
    } else {
      console.error('Unknown role:', role);
    }
  }
 
  
  

}
