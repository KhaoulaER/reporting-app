import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Role, User } from '../../../user/model/user';
import { AffecationService } from '../affecation.service';
import { Affectation } from '../../model/projet';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-affectation-add',
  templateUrl: './affectation-add.component.html',
  styleUrl: './affectation-add.component.css'
})
export class AffectationAddComponent implements OnChanges{
  auditeurs!:User[];
  @Input() selectedPro: any = null;
  @Input() showAddForm: boolean = true;
  @Output() clickAdd: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  newAffectation!:Affectation;
  proId:string='';
  droits:string[]=['read-only','read-write']

  constructor(
    private affectationService:AffecationService,
    private fb:FormBuilder,
    private messageService:MessageService,
    private route:ActivatedRoute
  ){
    this.newAffectation = {} as Affectation;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPro'] && this.selectedPro) {
      this.affectationService.findAuditors(Role.AUDITOR).subscribe(
        (data) => {
          this.auditeurs = data;
        }
      );
      this.proId = this.selectedPro.id;
      console.log('selected pro: ', this.proId);
    }
  }

  addAffectation=this.fb.group({
    auditeur: ['',[Validators.required]],
    droit: ['', [Validators.required]]
  })

  /*handleAddAuditeur() {
    if (this.addAffectation.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select an auditor' });
      return;
    }
  
    const selectedAuditorId = this.addAffectation.get('selectedAuditor')?.value;
    if (!selectedAuditorId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Auditor not selected' });
      return;
    }
  
    const affectation = {
      id: UUID.UUID(),
      auditeur: {id:selectedAuditorId},
      projet: {id:this.proId}
    };
  
    this.affectationService.createAffectation(affectation as Affectation).subscribe(
      response => {
        this.clickAdd.emit(response);
        console.log('auditeur affecté: ', response);
        this.showAddForm = false;
      },
      error => {
        console.error('Erreur lors de l\'affectation de l\'auditeur: ', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to assign auditor' });
      }
    );
  }*/

    formatFullName(auditeur: any): string {
      return `${auditeur.firstName} ${auditeur.lastName}`;
  }
  
  onSubmit(){
    if(this.addAffectation.valid){
      const formValue = this.addAffectation.value;
      const auditeur = this.auditeurs.find(a => a.id === formValue.auditeur);
  
      if (!auditeur) {
        console.error('No auditor found with the selected ID');
        return;
      }
  
      const affectationData = {
        id: UUID.UUID(),
        droit: formValue.droit,
        auditeur: auditeur,
        projet: { id: this.proId }
      };
  
      console.log('affectation data: ', affectationData);
      this.affectationService.createAffectation(affectationData as Affectation).subscribe(
        response => {
          this.clickAdd.emit(response);
          this.addAffectation.reset()
          this.closeAdd();
          this.showAddForm = false;
          console.log('auditeur affecté: ', response);
        },
        error => {
          console.error('Error during auditor assignment: ', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to assign auditor' });
        }
      );
    }
  }

  closeAdd(){
    this.showAddForm=false;
  }

  get auditeur(){
    return this.addAffectation.controls['auditeur']
  }
  get droit(){
    return this.addAffectation.controls['droit']
  }
}
