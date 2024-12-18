import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditHistoryService {
  private baseUrl = "http://localhost:3000/api";

  constructor(
    private http:HttpClient
  ) { }

  findHistoryAudit(managerId:string):Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/audit/audits-history/${managerId}`)
  }
   //liste des pc_audits par audit
   getPcsAudit(selectedAudit:string): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/pc-audit/${selectedAudit}/pcs`)
  }
}
