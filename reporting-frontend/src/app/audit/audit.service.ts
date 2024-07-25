import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chapitre, Preuve } from '../normes/model/norme';
import { NormeAdopte } from '../projets/model/projet';
import { Audit, PcAudit} from './model/audit';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private baseUrl = "http://localhost:3000/api";

  constructor(private http: HttpClient) {}

  /*findNCP(normeId: string): Observable<any[]> {
    return this.http.get<NormeAdopte[]>(`${this.baseUrl}/audit/${normeId}`);
  }*/

    findNCP(normeId: string): Observable<{ nms: NormeAdopte[], latestEvaluations: PcAudit[] }> {
      return this.http.get<{ nms: NormeAdopte[], latestEvaluations: any[] }>(`${this.baseUrl}/audit/${normeId}`);
    }
  

 /* createAudit(auditData: any, auditeurId:string, normeId:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/audit/${normeId}`, auditData);
  }
*/
  createAudit(auditData: any, auditeurId: string, normeId: string): Observable<Audit> {
    const url = `${this.baseUrl}/audit/${normeId}`;

    return this.http.post<Audit>(url, {
      id: UUID.UUID(),
      ...auditData,
      auditeur: auditeurId,
      normeAdopte: normeId,
    });
  }
  /*createPcAudites(pcAuditeData: any[]): Observable<any> {
    return this.http.post<PcAudit[]>(`${this.baseUrl}/pc-audit/`, pcAuditeData);
  }*/

    createPcAudites(pcAudite: PcAudit[]): Observable<any> {
      pcAudite.forEach(pa => pa.id = UUID.UUID());
      return this.http.post<PcAudit[]>(`${this.baseUrl}/pc-audit/`, pcAudite);
    }
  
    findTotalNiveau(normeId:string): Observable<any[]>{
      return this.http.get<any[]>(`${this.baseUrl}/pc-audit/${normeId}/conformite`);
    }

   

}
