import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientsService } from '../../../clients.service';
import { Client } from '../../../model/clients';

@Component({
  selector: 'app-clients-update',
  templateUrl: './clients-update.component.html',
  styleUrls: ['./clients-update.component.css']
})
export class ClientsUpdateComponent implements OnChanges {
  @Input() display: boolean = true;
  @Input() selectedClient: any = null;
  @Output() clickCloseMod: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickUpdateMod: EventEmitter<any> = new EventEmitter<any>();
  
  logo: string = '';

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private clientService: ClientsService
  ) {}

  updateClientForm = this.fb.group({
    nom: ['', [Validators.required]],
    email: ['', [Validators.required]],
    tel: ['', [Validators.required]],
    logo: ['']
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedClient) {
      this.updateClientForm.patchValue(this.selectedClient);
      this.logo = this.selectedClient.logo;
    } else {
      this.updateClientForm.reset();
      this.logo = '';
    }
  }

  handleSubmit() {
    const updatedData = this.updateClientForm.value;
    this.clientService.updateClient(updatedData as Client, this.selectedClient).subscribe(
      response => {
        this.clickUpdateMod.emit(response);
        this.clickCloseMod.emit(true);
        console.log(response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Client modifié' });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        console.log('Error occurred');
      }
    );
  }

  get nom() {
    return this.updateClientForm.controls['nom'];
  }

  get email() {
    return this.updateClientForm.controls['email'];
  }

  get tel() {
    return this.updateClientForm.controls['tel'];
  }

  get logoControl() {
    return this.updateClientForm.controls['logo'];
  }
}
