import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate,Router,RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { TokenStorageService } from '../services/token-storage.service';
import { RoleService } from '../services/role.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  serverUrl: string;

  constructor(
       private authenticationService: AuthenticationService,
       private route: Router,
       private http: HttpClient,
       private tokenStorageService: TokenStorageService,
       private roleService: RoleService ) {
        this.serverUrl = 'http://localhost:3000/api/auth/isAuthenticated';
      }

   async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):Promise<boolean> {
      // const refreshToken = this.cookieService.get('refresh_token');
      // const accesstoken = this.cookieService.get('access_token');


      const refreshToken = this.tokenStorageService.getRefreshToken();
      const accesstoken = this.tokenStorageService.getToken();


      if (state.url.includes('/auth/login')) {
        if (refreshToken) {
          this.authenticationService.tokenValidation(refreshToken).subscribe({
            next: (data) => {
              if (data === false) {
                return true;
              } else {
                // this.route.navigate(['/']);
                this.redirectBasedOnRole();
                return false;
              }
            },
            error: (e) => {
              console.log('AuthGuard: Token validation error', e);
              return true;
            },
          });
        }

        return true;
      }
      if (!refreshToken && !accesstoken) {
        this.route.navigate(['/auth/login']);
      }



      this.isAuthenticated().pipe(
        switchMap((data: any) => {
          return data.isAuthenticated;
        }),
        catchError(() => {
          return of(false);
        })
      );

      return true;
  }


    private redirectBasedOnRole() {
      if (this.roleService.isAdmin()) {
        this.route.navigate(['/admin']);
      }else {
        this.route.navigate(['/auth/login']);
      } /*else if (this.roleService.isClient()) {
        this.route.navigate(['/client']);
      } else if (this.roleService.isPentester()) {
        this.route.navigate(['/prestataire']);
      } */
    }

  public isAuthenticated(): Observable<{ isAuthenticated: boolean }> {
    return this.http.get<{ isAuthenticated: boolean }>(
      this.serverUrl,
      httpOptions
    );
  }
}

export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};