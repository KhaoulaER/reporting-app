import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Projet } from '../projets/model/projet';
import { Norme } from '../normes/model/norme';

@Injectable({
  providedIn: 'root'
})
export class ProjetAuditService {

  private baseUrl = "http://localhost:3000/api";
  constructor(private http:HttpClient) { 
    
  }

  findByAuditeur(auditeurId:string): Observable<any[]>{
    console.log('auditor from service: ', auditeurId)
    return this.http.get<any[]>(`${this.baseUrl}/affectation/pnaffectaion/${auditeurId}`)
  }

  /*getNormes(): Observable<Norme[]> {
    return this.http.get<Norme[]>(`${this.baseUrl}/normes`);
  }*/
    getNormes(projetId: string): Observable<any[]> {
      const url = `${this.baseUrl}/norme-adopte/pro-norme/${projetId}`;
      console.log('Fetching normes from URL:', url);
      return this.http.get<any[]>(url);
    }
}
