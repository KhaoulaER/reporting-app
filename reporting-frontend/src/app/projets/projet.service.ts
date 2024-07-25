import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NormeAdopte, Projet } from './model/projet';
import { Observable } from 'rxjs';
import { UUID } from 'angular2-uuid';
import { Client } from '../clients/model/clients';
import { Norme } from '../normes/model/norme';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {

  private baseUrl = "http://localhost:3000/api"
  constructor(private http:HttpClient) { }

  findAllByManagers(managerId:string): Observable<Projet[]>{
    return this.http.get<Projet[]>(`${this.baseUrl}/projets/mprojets/${managerId}`)
  }

  /*createProjet(projet: Projet, selectedClient: Client, managerId: string): Observable<Projet> {
    projet.id = UUID.UUID();
    projet.client = selectedClient;
    return this.http.post<Projet>(`${this.baseUrl}/projets/${managerId}`, { ...projet});
  }*/

    createProjet(managerId:string,projet:Projet){
      projet.id=UUID.UUID()
      return this.http.post<Projet>(`${this.baseUrl}/projets/${managerId}`, { ...projet});

    }

  createNormeAdopte(normeId:string,projetId:string, normeAdopte:NormeAdopte){
    normeAdopte.id=UUID.UUID();
    return this.http.post<NormeAdopte>(`${this.baseUrl}/norme-adopte/`,normeAdopte)
  }
  findByIds(ids: string[]): Observable<Norme[]> {
    return this.http.post<Norme[]>(`${this.baseUrl}/normes/find-by-ids`, { ids });
  }

  findNormeAdopte(selectedProjet:Projet):Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/norme-adopte/pro-norme/${selectedProjet.id}`)
  }
}
