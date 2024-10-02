
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Role, User } from '../../modules/user/model/user';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  private baseUrl = "http://localhost:3000/api/auth";
  public authenticatedUser: User | null=null;
  //public token: string | null = null;

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }


   ////// MTH3 SERVICE LOGIN

   login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post<any>(`${this.baseUrl}/login`, body, { withCredentials: true }).pipe(
      tap((response: any) => {
       console.log('response: ', response);
        if (response.access_token) {
          // Assuming the token is part of the response directly
          localStorage.setItem('access_token', response.access_token);
          const authUser: User = {
            id: response.userId || '',
            firstName: response.given_name || "", 
            lastName: response.family_name || "",  
            email: response.email || '',
            username: response.preferred_username || username,
            password: "", // Password is not needed here
            phone: response.phone || '',
            groups: response.groups ? response.groups[0] : 'UNKNOWN', // Default to UNKNOWN if not available
            token: response.access_token
          };
          this.authenticatedUser = authUser;
          console.log('User authenticated successfully:', this.authenticatedUser);
        } else {
          console.error('Missing access token in response');
        }
      }),
      catchError(error => {
        console.error('Error during login:', error);
        return throwError(error);
      })
    );
  }

  

  getAuthenticatedUser(): User | null {
    return this.authenticatedUser;
  }
private getAuthToken(): string | null {
    return localStorage.getItem('token'); // Assumes token is stored in localStorage
  }
// token validation
public tokenValidation(token: string) {
  return this.http.post(`${this.baseUrl}/TokenValidation`, {
    token,
  });
}

  //change password
  changePassword(newPassword: string): Observable<any> {
    const body = { newPassword };
    console.log('body: ', body);
  
    return this.http.put(`${this.baseUrl}/updatePassword`, body, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true  // Include credentials (like cookies) in this request
    });
  }

  isAuthenticated(): boolean {
    return !!this.authenticatedUser;
  }

  logout(): void {
    this.clearLocalStorage();
    /*this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.authenticatedUser = null;
    });*/
  }

  private saveUserToLocalStorage(user: User): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('authenticatedUser', JSON.stringify(user));
      console.log('Saved user to local storage:', user);
    }
  }
  
  private loadUserFromLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userJson = localStorage.getItem('authenticatedUser');
      if (userJson) {
        this.authenticatedUser = JSON.parse(userJson);
        console.log('Loaded user from local storage:', this.authenticatedUser);
      }
    }
  }
  
  private clearLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('authenticatedUser');
    }
  }
/*
    public logout(): void {
      // Logout by making an API call or by other means as per your backend
      this.authenticatedUser = undefined!;
    }*/

  
}
