import { Component, OnInit } from '@angular/core';
import { AuditHistoryService } from './audit-history.service';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { MessageService } from 'primeng/api';
import { Audit } from '../audit/model/audit';

@Component({
  selector: 'app-audit-history',
  templateUrl: './audit-history.component.html',
  styleUrl: './audit-history.component.css'
})
export class AuditHistoryComponent implements OnInit{
  audits!:any[];
  errorMessage!:string;
  managerId!:string
  selectedAudit:any = null;
  displayPc: boolean = false;
  constructor(
    private authService:AuthenticationService,
    private auditHistory:AuditHistoryService,
    private messageService:MessageService
  ){}
  ngOnInit(): void {
    this.managerId = this.authService.authenticatedUser?.id || '';
    console.log('manager id: ',this.managerId)
    if (this.managerId) {
      this.loadAudits(this.managerId)
    }  
  }

  loadAudits(managerId:string){
    this.auditHistory.findHistoryAudit(managerId).subscribe({
      next: (data)=>{
        console.log(data)
        this.audits=data
      },
      error: (err)=>{
        this.errorMessage = `Erreur: ${err.message}`;
      }
    })
  }

handleAuditDetails(audit:Audit){
  this.displayPc = false;  // Close the dialog first if already open
    setTimeout(() => {  // Ensure dialog opens after resetting values
      this.selectedAudit = audit;
      this.displayPc = true;
     
    }, 100);
}
}
