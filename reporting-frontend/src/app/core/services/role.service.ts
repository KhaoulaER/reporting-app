import { Injectable } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { TokenStorageService } from './token-storage.service';

interface MyTokenPayload extends JwtPayload {
  realm_access?: {
    roles: string[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(  private tokenStorageService: TokenStorageService,) { }

  getAuthUserId() {
    // const token = this.cookieService.get('access_token');
    const token = this.tokenStorageService.getToken();
    let decodedToken;
    if(token) {
      decodedToken =  jwtDecode<MyTokenPayload>(token);
    }

    return decodedToken?.sub;
  }

  getRole(){
    // const token = this.cookieService.get('access_token');
    const token = this.tokenStorageService.getToken();
    let decodedToken;
    if(token) {
      decodedToken =  jwtDecode<MyTokenPayload>(token);
    }

    return decodedToken?.realm_access?.roles;
  }

  isInRoles(roles: string[]): boolean {
    const userRoles = this.getRole();
    return userRoles ? roles.some(role => userRoles.includes(role)) : false;
  }

  isAdmin(): boolean {
    const roles = this.getRole();
    return roles ? roles.includes('admin') : false;
  }

  isAuditor(): boolean {
    const roles = this.getRole();
    return roles ? roles.includes('auditor') : false;
  }


  isClient(): boolean {
    const roles = this.getRole();
    return roles ? roles.includes('client') : false;
  }

  isPentester(): boolean {
    const roles = this.getRole();
    return roles ? roles.includes('pentester') : false;
  }

  isManager(): boolean {
    const roles = this.getRole();
    return roles ? roles.includes('manager') : false;
  }


}