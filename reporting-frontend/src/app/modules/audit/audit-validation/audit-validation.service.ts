import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NormeAdopte } from '../../projets/model/projet';

@Injectable({
  providedIn: 'root'
})
export class AuditValidationService {

  

  private validateButtonClickedSource = new BehaviorSubject<boolean>(false);
  validateButtonClicked$ = this.validateButtonClickedSource.asObservable();
  private baseUrl = "http://localhost:3000/api";

  constructor(private http: HttpClient) {}

  updateValidateButtonState(clicked: boolean): void {
    this.validateButtonClickedSource.next(clicked);
  }
  setValidationState(isValidated: boolean): void {
    this.validateButtonClickedSource.next(isValidated);
  }

  auditValidation(normeId: string,validation:boolean): Observable<any>{
    return this.http.patch(`${this.baseUrl}/norme-adopte/${normeId}/validation`, {validation});
  }

  
}
