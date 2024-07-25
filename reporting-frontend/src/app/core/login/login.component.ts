import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/layout/service/app.layout.service'; 
import { KeycloakService } from 'keycloak-angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { MessageService } from 'primeng/api';

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
      private messageService:MessageService
    ) { }
  ngOnInit(): void {
    this.loginFormGroup=this.fb.group({
      username: this.fb.control(""),
      password: this.fb.control("")
    })
  }
  handleLogin() {
    let username = this.loginFormGroup.value.username;
    let password = this.loginFormGroup.value.password;
    this.authenticationService.login(username, password).subscribe({
      next: (user) => {
        this.authenticationService.authenticateUser(user).subscribe({
          next: () => {
            this.router.navigateByUrl("/home-manager");
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vous êtes connecté' });
          },
          error: (authError) => {
            console.error('Authentication error:', authError);
          }
        });
      },
      error: (loginError) => {
        console.error('Login error:', loginError);
        this.errorMessage = "Login échoué, vérifiez vos identifiants.";
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Login échoué' });
      }
    });
  }
  
}
