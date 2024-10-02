import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeAuditorService {

  private baseUrl = "http://localhost:3000/api";
  
  constructor(private http: HttpClient) { }

  // total projets
  countTotalProjets(auditorId:string): Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/affectation/count-affectations/${auditorId}`)
  }

  // count non validated projects
  countNonValidatedProjects(auditorId:string): Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/count-not-validated-pro/${auditorId}`)
  }
}
