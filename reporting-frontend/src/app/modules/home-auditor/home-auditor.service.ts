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
    return this.http.get<number>(`${this.baseUrl}/affectation/count-not-validated-pro/${auditorId}`)
  }

  //count unaudited projects
  countUnauditedProjects(auditorId:string): Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/affectation/count-not-audited-pro/${auditorId}`)
  }

  
  //unaudited projects list
  UnauditedProjects(auditorId:string): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/affectation/not-audited-pro/${auditorId}`)
  }
}
