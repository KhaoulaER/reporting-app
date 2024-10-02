import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Norme } from './model/norme';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class NormesService {

  private baseUrl = "http://localhost:3000/api";
  constructor(private http: HttpClient) { }

  addNewNorm(norm:Norme){
    norm.id=UUID.UUID();
    return this.http.post(`${this.baseUrl}/normes`, norm);
  }

  findAll(): Observable<Norme[]> {
    return this.http.get<Norme[]>(`${this.baseUrl}/normes`);
  }

  updateNorme(normeData:any, selectedNorme:any){
    return this.http.patch<Norme>(`${this.baseUrl}/normes/${selectedNorme.id}`, normeData);
  }

  deleteNorme(normeId: string){
    return this.http.delete(`${this.baseUrl}/normes/${normeId}`);
  }
}
