import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Preuve } from '../../../model/norme';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreuveService {

  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  addNewPreuve(preuve: Preuve, selectedPc:any){
    preuve.id=UUID.UUID();
    console.log('Adding new PV:', preuve, 'to pc:', selectedPc.id);
    return this.http.post(`${this.baseUrl}/preuves/${selectedPc.id}`, preuve);
  }
  findAllByPc(pcId:string):Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/preuves/${pcId}`)
  }

  updatePc(preuveData: any, selectedPreuve:any){
    return this.http.patch<Preuve>(`${this.baseUrl}/preuves/${selectedPreuve.id}`, preuveData);
  }

  deletePreuve(preuveId: string){
    return this.http.delete(`${this.baseUrl}/preuves/${preuveId}`);
  }
}
