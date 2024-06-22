import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './model/user';
import { UUID } from 'angular2-uuid';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = "http://localhost:3000";

  constructor(private http:HttpClient) { }

  public addNewUser(user:User){
    user.id=UUID.UUID();
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  findAll(): Observable<User[]> {
    return this.http.get<{ Users: User[] }>(this.baseUrl).pipe(
      map(response => response.Users)
    );
  }

  findAllByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/${role}`);
  }

  updateUser(userData: any, selectedUser:any){
    
    return this.http.patch<User>(`${this.baseUrl}/users/${selectedUser.id}`, userData);
    }
 

  deleteUser(userId: string){
    return this.http.delete(`${this.baseUrl}/users/${userId}`);
  }

  
}
