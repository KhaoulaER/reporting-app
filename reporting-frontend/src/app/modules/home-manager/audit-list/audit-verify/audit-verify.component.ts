import { Component, Input, OnInit } from '@angular/core';
import { HomeManagerService } from '../../home-manager.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-audit-verify',
  templateUrl: './audit-verify.component.html',
  styleUrl: './audit-verify.component.css'
})
export class AuditVerifyComponent implements OnInit{
  
  @Input() displayPc: boolean = false;
  @Input() selectedAudit: any = null;
  
  pcAudits: any[] = [];

  constructor(
    private homeManagerService: HomeManagerService,
    private messageService:MessageService
  ) {}

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
    this.homeManagerService.getPcsAudit(auditId).subscribe({
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
