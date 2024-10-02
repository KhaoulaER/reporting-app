import { Component, OnInit } from '@angular/core';
import { Client } from '../model/clients';
import { ClientsService } from '../clients.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.css'
})
export class ClientsListComponent implements OnInit{
  clients!: any[];
  client!: Client;
  //add client modal
  visible: boolean = false;
  errorMessage: string='';
  //update client modal
  selectedClient: any = null;
  display: boolean = false;
  constructor(
    private clientService:ClientsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ){}
  ngOnInit(): void {
    this.loadClients();
  }

  loadClients():void{
    this.clientService.findAll().subscribe({
      next: (data)=>{
        console.log(data);
        this.clients=data;
      },
      error: (err)=>{
        this.errorMessage = `Failed to load norms: ${err.message}`;
      }
    });
  }
  //DELETE MODAL
  handleDeleteClient(client:Client){
    this.confirmationService.confirm({
      message: 'Voulez vous supprimer ce client ?',
      header: 'Confirmer la suppression',
      icon: 'pi pi-info-circle',
      rejectButtonStyleClass:"p-button-danger p-button-text",
      acceptButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.clientService.deleteClient(client.id).subscribe(
          response => {
            this.clients = this.clients.filter(data => data.id !== client.id);
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Client supprimée' });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Vous avez refusé' });
          }
        )
      }
    })
  }
  //UPDATE MODAL
  handleEditClient(client:Client){
    this.display=true;
    this.selectedClient=client;
  }
  updateNorm(newData: any){
    if(newData.id === this.selectedClient.id){
      const norm = this.clients.findIndex(data => data.id === newData.id)
      this.clients[norm]=newData;
    }else{
      this.clients.unshift(newData);
    }
    this.loadClients();
  }


  //ADD MODAL
  showAddModal(event:any){
    this.visible=true;

  }
  
  onCancel(isClosed: boolean) {
    this.visible = !isClosed;
  }

  saveClient(newData:any){
    if (this.clients) {
      this.clients.unshift(newData); // Ajouter le nouveau client au début de la liste
    } else {
      this.clients = [newData]; // Initialiser la liste avec le nouveau client s'il est vide
    }
  }

  //UPDATE CLIENT
  updateClient(newData:any){
    if(newData.id === this.selectedClient.id){
      const norm = this.clients.findIndex(data => data.id === newData.id)
      this.clients[norm]=newData;
    }else{
      this.clients.unshift(newData);
    }
    this.loadClients();

  }
  cancelUpdate(isClosed: boolean){
    this.display = !isClosed;
  }

}
