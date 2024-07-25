import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NormeAdopte } from '../../projets/model/projet';
import { ActivatedRoute } from '@angular/router';
import { AuditValidationService } from '../audit-validation/audit-validation.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-audit-head',
  templateUrl: './audit-head.component.html',
  styleUrl: './audit-head.component.css'
})
export class AuditHeadComponent implements OnInit {
  @Input() normeId='';
  @Input() normeAdopte!:NormeAdopte;
  @Input() isValidateButtonClicked = false;
  @Output() clickSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickValidate: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickRepport: EventEmitter<any> = new EventEmitter<any>();
  @Output() downloadReport: EventEmitter<void> = new EventEmitter<void>();
  readonly EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  readonly EXCEL_EXTENSION = '.xlsx';

  isProjectManager: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private auditValidationService:AuditValidationService,
    private messageService:MessageService
  ){}
  ngOnInit(): void {
     // Initialisation de l'état de validation
  this.checkIfProjectManager()
  }
  checkIfProjectManager(): void {
    const path = this.route.snapshot.url.map(segment => segment.path).join('/');
    console.log('Route path:', path);
    this.isProjectManager = path.includes('audit-manager');
    console.log('Is Project Manager:', this.isProjectManager);
  }

  savePcAudites(){

  }

  handleValidateClick(): void {
    this.auditValidationService.updateValidateButtonState(true);
    this.auditValidationService.auditValidation(this.normeAdopte.id, true).subscribe({
      next: (response) => {
        console.log('Audit validated successfully:', response);
        this.isValidateButtonClicked = true;
        //this.disableFormControls();
        this.clickValidate.emit(response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Audit Validé !' });

      },
      error: (err) => {
        console.error('Error validating audit:', err);
      }
    });
  }

  handleRepport(): void {
    this.clickRepport.emit();
  }

  exportToExcel(data: any[]): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'rapport');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + this.EXCEL_EXTENSION);
  }
}
