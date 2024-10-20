import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AuthenticationService } from './authentication/authentication.service';
import { Router } from '@angular/router';
import { TokenStorageService } from './services/token-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthenticationService,
    public tokenStorage:TokenStorageService,
    private router: Router  // Inject the Router for redirection

  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = null;

    if (isPlatformBrowser(this.platformId)) {
      //console.log('Running in browser');
      token = localStorage.getItem('access_token');
    } else {
      console.log('Not running in browser');
    }
    

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Token has expired or is invalid, so redirect to login page
            this.handleTokenExpiration();
          }
          return throwError(error);
        })
      );
    } else {
      console.log('No token available for request');
      return next.handle(req)
    }
  }
  private handleTokenExpiration(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.tokenStorage.signOut()  // Optional: Clear the expired token
    }
    this.router.navigateByUrl('/auth/login');
    // Redirect the user to the login page
  }
}
