import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PointsControle } from '../../model/norme';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class PointsControleService {

  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) { }

  addNewPc(pc: PointsControle,chapitreId:string){
    pc.id=UUID.UUID();
    console.log('Adding new PC:', pc, 'to chapitre:', chapitreId);
    return this.http.post(`${this.baseUrl}/points-controle/${chapitreId}`, pc);
  }

  findAllByChapitre(chapitreId:string):Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/points-controle/${chapitreId}`)
  }

  updatePc(pcData: any, selectedPc:any){
    return this.http.patch<PointsControle>(`${this.baseUrl}/points-controle/${selectedPc.id}`, pcData);
  }

  deletePc(pcId: string){
    return this.http.delete(`${this.baseUrl}/points-controle/${pcId}`);
  }
}
