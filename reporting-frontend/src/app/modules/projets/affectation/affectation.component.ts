import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Affectation, Projet } from '../model/projet';
import { AffecationService } from './affecation.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-affectation',
  templateUrl: './affectation.component.html',
  styleUrl: './affectation.component.css'
})
export class AffectationComponent implements OnChanges, OnInit{
  affectations!: Affectation[];
  @Input() showAuditors:boolean=true;
  @Input() selectedPro!:Projet;
  //NOUVELLE AFFECTATION
  showAddForm:boolean=false
  droits:string[]=['read-only','read-write']
  droit: string = ''

  constructor(
    private affectationService:AffecationService,
    private confirmationService:ConfirmationService,
    private messageService: MessageService,
    private fb:FormBuilder
  ){}
  ngOnInit(): void {
    //this.affectationService.findDroit(aff)
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedPro'] && this.selectedPro){
    this.affectationService.findByProjet(this.selectedPro.id).subscribe(
      (data)=>{
        this.affectations=data
        console.log('affectations: ',this.affectations)
      }
    )
  }
  }

  updateAffectation=this.fb.group({
    droit:['']
  })

  handleDeleteAffectation(affectation:Affectation){
    this.confirmationService.confirm({
      message: 'Voulez vous supprimer cet auditeur ?',
      header: 'Confirmer la suppression',
      icon: 'pi pi-info-circle',
      rejectButtonStyleClass:"p-button-danger p-button-text",
      acceptButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
        this.affectationService.removeAffectation(affectation.id).subscribe(
          response => {
            this.affectations = this.affectations.filter(data => data.id !== affectation.id);
            this.messageService.add({ severity: 'info', summary: 'Confirmé', detail: 'Auditeur supprimée' });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Rejecté', detail: 'Vous avez refusé' });
          }
        )
      }
    })
  }

// Handle updating the affectation (auditor's role)
handleEditAffectation(affectation: Affectation) {
  const updatedAffectation = { ...affectation, droit:affectation.droit };  // Assign selected role to the affectation

  this.affectationService.updateAffectation(affectation.id, updatedAffectation).subscribe(
    (response) => {
      console.log('affectation response:',response)
      this.messageService.add({ severity: 'success', summary: 'Modifié', detail: 'Rôle de l\'auditeur modifié' });
    },
    (error) => {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour du rôle' });
    }
  );
}

  addAffectation(newAffectation: any):void{
    this.affectations.unshift(newAffectation);
  }
  onCancel(isClosed:boolean){
    this.showAddForm=!isClosed
  }
}
