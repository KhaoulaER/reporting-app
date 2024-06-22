import { Component } from '@angular/core';
import { LayoutService } from '../shared/layout/service/app.layout.service'; 
import { KeycloakService } from 'keycloak-angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

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
export class LoginComponent {

    valCheck: string[] = ['remember'];

    email!: string;
    password!: string;

    constructor(public layoutService: LayoutService, private keycloakService: KeycloakService, private http:HttpClient, private router:Router) { }
    async login(){
       /*try {
            await this.keycloakService.login({
              username: this.email,
              password: this.password
            });
          } catch (error) {
            console.error('Erreur de connexion', error);
          }*/
    }
}
