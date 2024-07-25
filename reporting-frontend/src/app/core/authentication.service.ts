import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Role, User } from '../user/model/user';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  private baseUrl = "http://localhost:3000/api/auth/login";
  public authenticatedUser!: User;
  constructor(
    private http:HttpClient
  ) { }

  public login(username: string, password: string): Observable<User> {
    const body = { username, password };
    return this.http.post<User>(this.baseUrl, body);
  }

  public authenticateUser(user:User): Observable<boolean>{
    this.authenticatedUser=user;
    const authUser = {
      username: user.username,
      role: user.role,
      jwt: "JWT_TOKEN" // Remplacez par le véritable jeton JWT
    };
    localStorage.setItem("authUser", JSON.stringify(authUser));
    return of(true)
  }

  public getAuthenticatedUser(): User | null {
    return this.authenticatedUser;
  }

  public hasRole(role: Role): boolean{
    return this.authenticatedUser?.role.includes(role);
  }
  public isAuthenticated(){
    return this.authenticatedUser!=undefined;
  }
}
