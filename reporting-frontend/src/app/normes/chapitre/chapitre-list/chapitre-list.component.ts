import { Component, OnInit } from '@angular/core';
import { ChapitreService } from '../chapitre.service';
import { ActivatedRoute } from '@angular/router';
import { Chapitre, Norme } from '../../model/norme';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-chapitre-list',
  templateUrl: './chapitre-list.component.html',
  styleUrl: './chapitre-list.component.css'
})
export class ChapitreListComponent implements OnInit{
  normeId: string = '';
  norme!: Norme;
  chapitres!: any[];
  newChapitreTitle: string = ''; // Titre du nouveau chapitre
  showAddForm: boolean = false; 
  display: boolean = false;
  selectedChapitre: any = null;
constructor(
  private chapitreService:ChapitreService, 
  private route: ActivatedRoute,
  private confirmationService: ConfirmationService,
  private messageService:MessageService
){}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.normeId = params.get('normeId') || '';
      if (this.normeId) {
        this.loadChapitres();
      } else {
        // Gérer le cas où normeId est null
        console.error('normeId is null');
      }
    });
  }

  saveChapitre(newData:any): void {
    this.chapitres.unshift(newData);
  }

  cancelAdd(isClosed: boolean): void {
    this.showAddForm = !isClosed;
  }

  loadChapitres(): void {
    this.chapitreService.findAllByNorme(this.normeId).subscribe((data: any[]) => {
      this.chapitres = data;
    });
  }
  handleDeleteChapitre(chapitre:Chapitre){
    this.confirmationService.confirm({
      message: 'Voulez vous supprimer ce chapitre ?',
      header: 'Confirmer la suppression',
      icon: 'pi pi-info-circle',
      rejectButtonStyleClass:"p-button-danger p-button-text",
      acceptButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.chapitreService.deleteChapitre(chapitre.id).subscribe(
          response => {
            this.chapitres = this.chapitres.filter(data => data.id !== chapitre.id);
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Chapitre supprimé' });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Vous avez refusé' });
          }
        )
      }
    })
  }
  handleEditChapitre(chapitre:Chapitre){
    this.display=true;
    this.selectedChapitre=chapitre;
  }

  updateChapitre(newData: any){
    if(newData.id === this.selectedChapitre.id){
      const chapitre = this.chapitres.findIndex(data => data.id === newData.id)
      this.chapitres[chapitre]=newData;
    }else{
      this.chapitres.unshift(newData);
    }
    this.ngOnInit();
  }
  cancelUpdate(isClosed: boolean){
    this.display = !isClosed;
  }
}
