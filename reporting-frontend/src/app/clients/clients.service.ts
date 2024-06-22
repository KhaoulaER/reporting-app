import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from './model/clients';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private baseUrl = "http://localhost:3000";
  constructor(private http: HttpClient) { }
  /*addNewClient(client:Client){
    client.id = UUID.UUID();
    let formData = new FormData();
    formData.set('id', client.id);
    formData.set('nom', client.nom);
    formData.set('email', client.email);
    formData.set('tel', client.tel);
    formData.set('logo', client.logo);
    return this.http.post(`${this.baseUrl}/clients`, formData);
  }*/
    addNewClient(formData:FormData): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/clients`, formData);
    }
 
  findAll(): Observable<Client[]>{
    return this.http.get<Client[]>(`${this.baseUrl}/clients`);
  }
  updateClient(ClientData:any, selectedClient:any){
    return this.http.patch<Client>(`${this.baseUrl}/clients/${selectedClient.id}`, ClientData);
  }

  deleteClient(ClientId: string){
    return this.http.delete(`${this.baseUrl}/clients/${ClientId}`);
  }

}
