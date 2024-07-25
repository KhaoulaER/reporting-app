import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Affectation, Projet } from '../model/projet';
import { Observable } from 'rxjs';
import { Role, User } from '../../user/model/user';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class AffecationService {

  private baseUrl = "http://localhost:3000/api"

  constructor(private http:HttpClient) { }
  findByProjet(projetId:string):Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/affectation/pauditeurs/${projetId}`)
  }
  
  //POUR DROPDOWN
  findAuditors(role:Role): Observable<User[]>{
    //role = Role.AUDITOR
    return this.http.get<User[]>(`${this.baseUrl}/users/${role}`)
  }

  //NOUVELLE AFFECTATION
  createAffectation(affectation:Affectation){
   affectation.id = UUID.UUID();
    return this.http.post(`${this.baseUrl}/affectation`,affectation)
  }

  //SUPPRIMER AFFECTATION
  removeAffectation(affectationId: string){
    return this.http.delete(`${this.baseUrl}/affectation/${affectationId}`)
  }
}
