import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chapitre, Preuve } from '../normes/model/norme';
import { NormeAdopte } from '../projets/model/projet';
import { Audit, PcAudit} from './model/audit';
import { UUID } from 'angular2-uuid';
import { User } from '../user/model/user';

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
  

      createAudit(normeId: string, audit: Audit): Observable<Audit> {
        audit.id = UUID.UUID();  // Assuming you generate audit IDs in the frontend
        return this.http.post<Audit>(`${this.baseUrl}/audit/${normeId}`, audit);
      }
  /*createPcAudites(pcAuditeData: any[]): Observable<any> {
    return this.http.post<PcAudit[]>(`${this.baseUrl}/pc-audit/`, pcAuditeData);
  }*/

    createPcAudites(pcAudite: PcAudit): Observable<any> {
      //pcAudite.forEach(pa => pa.id = UUID.UUID());
      return this.http.post<PcAudit[]>(`${this.baseUrl}/pc-audit/`, pcAudite);
    }
  
    findTotalNiveau(normeId:string): Observable<any[]>{
      return this.http.get<any[]>(`${this.baseUrl}/pc-audit/${normeId}/conformite`);
    }

    findConstatsForPoint(pointId:string,normeAdopteId:string): Observable<any[]>{
      return this.http.get<any[]>(`${this.baseUrl}/pc-audit/constats/${pointId}/${normeAdopteId}`)
    }
    findPreuvesForPoint(pointId:string,normeAdopteId:string): Observable<any[]>{
      return this.http.get<any[]>(`${this.baseUrl}/pc-audit/preuves/${pointId}/${normeAdopteId}`)
    }
    findRecommandationForPoint(pointId:string,normeAdopteId:string): Observable<any[]>{
      return this.http.get<any[]>(`${this.baseUrl}/pc-audit/recommandations/${pointId}/${normeAdopteId}`)
    }
    findNiveau(pointId:string,normeAdopteId:string): Observable<any>{
      return this.http.get<any>(`${this.baseUrl}/pc-audit/niveau/${pointId}/${normeAdopteId}`)
    }

   /* generateRecommandations(seletedPcAudit:string, recommandations: string): Observable<PcAudit>{
      return this.http.patch<PcAudit>(`${this.baseUrl}/pc-audit/${seletedPcAudit}`,recommandations)
    }
   */

    generateRecommendations(norm: string, designation: string, constat: string): Observable<any> {
      const prompt = `Norm: ${norm}, Designation: ${designation}, Constat: ${constat}`;
      return this.http.post<any>(this.baseUrl, { prompt });
    }

    deleteConstat(pcAuditId:string){
      return this.http.patch(`${this.baseUrl}/pc-audit/delete-constat/${pcAuditId}`,null)
    }
    updateConstat(pcAuditId:string,newConstat:any){
      console.log('constat in front service: ', newConstat)
      return this.http.patch(`${this.baseUrl}/pc-audit/update-constat/${pcAuditId}`,{constat:newConstat})
    }
    deletePreuve(pcAuditId:string){
      return this.http.patch(`${this.baseUrl}/pc-audit/delete-preuve/${pcAuditId}`,null)
    }
    deleteRecommandation(pcAuditId:string){
      return this.http.patch(`${this.baseUrl}/pc-audit/delete-recommandation/${pcAuditId}`,null)
    }

    getFirstAuditor(normeAdopteId:string):Observable<User>{
      return this.http.get<User>(`${this.baseUrl}/audit/first-auditor/${normeAdopteId}`)
    }

    checkDowloadState(auditId:string): Observable<any>{
      return this.http.patch(`${this.baseUrl}/audit/${auditId}/downloaded`,{downloaded : true})
    }

}
