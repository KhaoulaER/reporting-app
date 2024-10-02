import { Component, OnInit } from '@angular/core';
import { Norme } from '../model/norme';
import { ActivatedRoute } from '@angular/router';
import { NormesService } from '../normes.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-norme-list',
  templateUrl: './norme-list.component.html',
  styleUrl: './norme-list.component.css'
})
export class NormeListComponent implements OnInit{
  normes!: Norme[]
  errorMessage!: string;
  visible: boolean = false;
  selectedNorm: any = null;
  display: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private normeService: NormesService,
    private confirmationService: ConfirmationService,
    private messageService:MessageService
  ){

  }
  ngOnInit(): void {
    this.loadNorms();
  }

  onCancel(isClosed: boolean) {
    this.visible = !isClosed;
  }

  loadNorms():void{
    this.normeService.findAll().subscribe({
      next: (data)=>{
        console.log(data);
        this.normes=data;
      },
      error: (err)=>{
        this.errorMessage = `Failed to load norms: ${err.message}`;
      }
    });
  }


  showAddModal(event:any){
    this.visible=true;

  }


  saveNorm(newData:any){
    this.normes.unshift(newData);
  }

  updateNorm(newData: any){
    if(newData.id === this.selectedNorm.id){
      const norm = this.normes.findIndex(data => data.id === newData.id)
      this.normes[norm]=newData;
    }else{
      this.normes.unshift(newData);
    }
    this.loadNorms();
  }
  cancelUpdate(isClosed: boolean){
    this.display = !isClosed;
  }

  handleEditNorm(norm:Norme, position:string){
    this.display=true;
    this.selectedNorm=norm;
    
  }

  handleDeleteNorm(norme:Norme){
    this.confirmationService.confirm({
      message: 'Voulez vous supprimer cette norme ?',
      header: 'Confirmer la suppression',
      icon: 'pi pi-info-circle',
      rejectButtonStyleClass:"p-button-danger p-button-text",
      acceptButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.normeService.deleteNorme(norme.id).subscribe(
          response => {
            this.normes = this.normes.filter(data => data.id !== norme.id);
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Norme supprimée' });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Vous avez refusé' });
          }
        )
      }
    })
  }

  
}
