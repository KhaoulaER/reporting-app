import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuditValidationService } from './audit-validation.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-audit-validation',
  templateUrl: './audit-validation.component.html',
  styleUrls: ['./audit-validation.component.css']
})
export class AuditValidationComponent {

  @Output() validateButtonClick = new EventEmitter<void>();
  @Input() isValidateButtonClicked = false;

  constructor(private auditValidationService: AuditValidationService,
    private messageService: MessageService
  ) {}

  onValidateClick(): void {
    this.auditValidationService.updateValidateButtonState(true);
    this.validateButtonClick.emit();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Audit Validé !' });

  }
  }
   


