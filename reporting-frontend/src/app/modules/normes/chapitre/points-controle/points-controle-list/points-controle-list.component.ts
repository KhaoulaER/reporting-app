import { Component, OnInit } from '@angular/core';
import { Chapitre, PointsControle } from '../../../model/norme';
import { PointsControleService } from '../points-controle.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-points-controle-list',
  templateUrl: './points-controle-list.component.html',
  styleUrl: './points-controle-list.component.css'
})
export class PointsControleListComponent implements OnInit{
  pcs!: any[];
  chapitre!: Chapitre;
  chapitreId: string = '';
  //AJOUT
  showAddForm: boolean = false; 
  //MODIFICATION
  display: boolean = false;
  selectedPc: any = null;
  //PREUVES
  showPreuves: boolean = false;
  selectedPcc: any = null;
  constructor(
    private route: ActivatedRoute,
    private pcService:PointsControleService,
    private confirmationService:ConfirmationService,
    private messageService:MessageService
  ){}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chapitreId = params.get('chapitreId') || '';
      if (this.chapitreId) {
        this.loadPcs();
      } else {
        // Gérer le cas où normeId est null
        console.error('chapitreId is null');
      }
    });
  }

  loadPcs():void{
    this.pcService.findAllByChapitre(this.chapitreId).subscribe((data)=>{
      this.pcs =data
    });
  }
  savePc(newPc:any):void{
    this.pcs.unshift(newPc);
    this.loadPcs();
  }
  cancelAdd(isClosed: boolean): void {
    this.showAddForm = !isClosed;
  }
  handleDeletePc(pc:PointsControle){
    this.confirmationService.confirm({
      message: 'Voulez vous supprimer ce PC ?',
      header: 'Confirmer la suppression',
      icon: 'pi pi-info-circle',
      rejectButtonStyleClass:"p-button-danger p-button-text",
      acceptButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.pcService.deletePc(pc.id).subscribe(
          response => {
            this.pcs = this.pcs.filter(data => data.id !== pc.id);
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Point de controle supprimé' });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Vous avez refusé' });
          }
        )
      }
    })
  }
  handleEditPc(pc:PointsControle){
    this.display=true;
    this.selectedPc=pc;
  }
  updatePc(newData: any){
    if(newData.id === this.selectedPc.id){
      const pc = this.pcs.findIndex(data => data.id === newData.id)
      this.pcs[pc]=newData;
      this.display=false;
    }else{
      this.pcs.unshift(newData);
    }
    this.ngOnInit();
  }
  cancelUpdate(event:any){
    this.display = false;
  }

  //preuves
  cancelPreuves(event:any){
    this.showPreuves = false;
  }

  handleShowPreuves(pc:PointsControle){
    this.showPreuves=true;
    this.selectedPcc=pc;
  }
}
