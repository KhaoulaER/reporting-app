import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chapitre, Norme } from '../model/norme';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class ChapitreService {


  private baseUrl = 'http://localhost:3000'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) { }

  addNewChapter(chapitre:Chapitre,normeId:string){
    chapitre.id=UUID.UUID();
    return this.http.post(`${this.baseUrl}/chapitres/${normeId}`, chapitre);
  }

  findAllByNorme(normeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/chapitres/${normeId}`);
  }

  updateChapitre(chapitreData: any, selectedChapitre:any){
    return this.http.patch<Chapitre>(`${this.baseUrl}/chapitres/${selectedChapitre.id}`, chapitreData);
  }

  deleteChapitre(chapitreId: string){
    return this.http.delete(`${this.baseUrl}/chapitres/${chapitreId}`);
  }
}
