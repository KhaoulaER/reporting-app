import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Affectation, Projet } from '../model/projet';
import { AffecationService } from './affecation.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-affectation',
  templateUrl: './affectation.component.html',
  styleUrl: './affectation.component.css'
})
export class AffectationComponent implements OnChanges{
  affectations!: Affectation[];
  @Input() showAuditors:boolean=true;
  @Input() selectedPro!:Projet;
  //NOUVELLE AFFECTATION
  showAddForm:boolean=false

  constructor(
    private affectationService:AffecationService,
    private confirmationService:ConfirmationService,
    private messageService: MessageService
  ){}

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

  handleDeleteAffectation(affectation:Affectation){
    this.confirmationService.confirm({
      message: 'Voulez vous suppromer cet auditeur ?',
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

  addAffectation(newAffectation: any):void{
    this.affectations.unshift(newAffectation);
  }
  onCancel(isClosed:boolean){
    this.showAddForm=!isClosed
  }
}
