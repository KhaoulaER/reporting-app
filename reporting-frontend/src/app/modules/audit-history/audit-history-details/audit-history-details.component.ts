import { Component, Input, OnInit } from '@angular/core';
import { AuditHistoryService } from '../audit-history.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-audit-history-details',
  templateUrl: './audit-history-details.component.html',
  styleUrl: './audit-history-details.component.css'
})
export class AuditHistoryDetailsComponent implements OnInit{
  @Input() displayPc: boolean = false;
  @Input() selectedAudit: any = null;
  
  constructor(
    private auditHistory:AuditHistoryService,
    private messageService:MessageService

  ){}
  pcAudits: any[] = [];
  ngOnInit(): void {
 if (this.selectedAudit) {
      this.loadPcAudits(this.selectedAudit.id);
    }
    }

    ngOnChanges(): void {
      if (this.selectedAudit) {
        this.loadPcAudits(this.selectedAudit.id);
      }
    }
  
    loadPcAudits(auditId: string): void {
      this.auditHistory.getPcsAudit(auditId).subscribe({
        next: (data) => {
          this.pcAudits = data;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des points de contrôle:', err);
        }
      });
    }
  
    onClose(): void {
      this.displayPc = false;
    }
    

}
