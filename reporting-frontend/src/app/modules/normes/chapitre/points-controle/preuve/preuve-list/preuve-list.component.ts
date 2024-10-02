import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Preuve } from '../../../../model/norme';
import { PreuveService } from '../preuve.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preuve-list',
  templateUrl: './preuve-list.component.html',
  styleUrl: './preuve-list.component.css'
})
export class PreuveListComponent {
  preuves!: any[];
  //afficher les preuves
  @Input() showPreuves: boolean = true;
  @Input() selectedPcc: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  preuve!: Preuve;
  showAddForm: boolean = false; 
  constructor(
    private fb:FormBuilder, 
    private preuveService:PreuveService,
    private messageService:MessageService,
    private route:ActivatedRoute,
    private confirmationService:ConfirmationService
  ){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPcc'] && this.selectedPcc) {
      this.loadPreuves(this.selectedPcc.id);
    }
  }


  loadPreuves(pointControleId: string): void {
    this.preuveService.findAllByPc(pointControleId).subscribe((data) => {
      this.preuves = data;
    });
  }

  handleEditPreuve(preuve:Preuve){

  }
  handleDeletePreuve(preuve:Preuve){
    this.confirmationService.confirm({
      message: 'Voulez vous supprimer ce PC ?',
      header: 'Confirmer la suppression',
      icon: 'pi pi-info-circle',
      rejectButtonStyleClass:"p-button-danger p-button-text",
      acceptButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.preuveService.deletePreuve(preuve.id).subscribe(
          response => {
            this.preuves = this.preuves.filter(data => data.id !== preuve.id);
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Preuve supprimé' });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Vous avez refusé' });
          }
        )
      }
    })
  }

}
