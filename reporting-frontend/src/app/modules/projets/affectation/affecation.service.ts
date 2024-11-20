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
  findAuditors(group:string): Observable<User[]>{
    //role = Role.AUDITOR
    group = 'AUDITOR'
    return this.http.get<User[]>(`${this.baseUrl}/users/${group}`)
  }

  findNotAffected(projetId:string): Observable<User[]>{
    return this.http.get<User[]>(`${this.baseUrl}/affectation/not-affected/${projetId}`)
  }

  //NOUVELLE AFFECTATION
  createAffectation(affectation:Affectation){
   affectation.id = UUID.UUID();
   console.log("affectation data service: ", affectation)
    return this.http.post(`${this.baseUrl}/affectation`,affectation)
  }

  //SUPPRIMER AFFECTATION
  removeAffectation(affectationId: string){
    return this.http.delete(`${this.baseUrl}/affectation/${affectationId}`)
  }

  //MODIFIER AFFECTATION
  updateAffectation(affectationId: string, affectationData: any){
    return this.http.patch<Affectation>(`${this.baseUrl}/affectation/${affectationId}`,affectationData)
  }
  //Recuperer le droit
  findDroit(affectationId: string){
    return this.http.get<string>(`${this.baseUrl}/affectations/droit/${affectationId}`)
  }
}
