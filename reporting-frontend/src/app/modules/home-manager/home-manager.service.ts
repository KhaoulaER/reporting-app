import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeManagerService {

  private baseUrl = "http://localhost:3000/api";
  constructor(private http: HttpClient) { }
  

  //total des projets 
  countProjects(managerId:string): Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/projets/count-projects/${managerId}`)

  }
  // nombre des projets non valides
 getProjectsCount(managerId:string): Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/projets/count-not-validated/${managerId}`)
  }

// Total des audits

  countAudits(managerId:string):Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/audit/count-audits/${managerId}`)
  }

  // nombre des audits non verifies
  getAuditsCount(managerId:string): Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/audit/count-not-controlled/${managerId}`)
  }

  //liste des projets non valides
  getProjects(managerId:string): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/projets/pro-not-validated/${managerId}`)
  }

  //liste des audits non verfies
  getAudits(managerId:string):Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/audit/audits-not-controlled/${managerId}`)
  }

  //liste des pc_audits par audit
  getPcsAudit(selectedAudit:string): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/pc-audit/${selectedAudit}/pcs`)
  }

  // Update audit control state
updateAuditControl(auditId: string): Observable<any> {
  return this.http.patch(`${this.baseUrl}/audit/${auditId}/control`, { control: true });
}


}
