import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { HomeManagerService } from '../home-manager.service';
import { Audit } from '../../audit/model/audit';
import { AuditService } from '../../audit/audit.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrl: './audit-list.component.css'
})
export class AuditListComponent implements OnInit{

  audits!:any[];
  errorMessage!:string;
  managerId!:string
  selectedAudit:any = null;
  displayPc: boolean = false;
  @Input() displayAuditList=true;
  constructor(
    private authService:AuthenticationService,
    private homeManagerService:HomeManagerService,
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
    this.homeManagerService.getAudits(managerId).subscribe({
      next: (data)=>{
        console.log(data)
        this.audits=data
      },
      error: (err)=>{
        this.errorMessage = `Erreur: ${err.message}`;
      }
    })
  }

  handleVerifyAudit(audit: Audit) {
    this.displayPc = false;  // Close the dialog first if already open
    setTimeout(() => {  // Ensure dialog opens after resetting values
      this.selectedAudit = audit;
      this.displayPc = true;
      // Call the service to update the control state
    this.homeManagerService.updateAuditControl(audit.id).subscribe({
      next: (response) => {
        // Update the audit object with the updated control state
        const updatedAudit = this.audits.find(a => a.id === audit.id);
        if (updatedAudit) {
          updatedAudit.control = true;  // or response.audit.control if returned by backend
        }

        console.log('audit control: ', updatedAudit.control);
        //this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Audit Verifié !' });
      },
      error: (err) => {
        console.error('Error updating audit control state:', err);
        //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to verify audit.' });
      }
    });
    }, 100);
  }
  
}
