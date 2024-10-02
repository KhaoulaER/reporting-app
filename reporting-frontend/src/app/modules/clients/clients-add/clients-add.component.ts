import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Client } from '../model/clients';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ClientsService } from '../clients.service';
import { passwordMatchValidator } from '../../../shared/password-match.directive';
import { UUID } from 'angular2-uuid';
import {
  HttpClientModule,
  HttpClient,
  HttpEventType,
} from '@angular/common/http';

@Component({
  selector: 'app-clients-add',
  templateUrl: './clients-add.component.html',
  styleUrl: './clients-add.component.css'
})
export class ClientsAddComponent implements OnInit{
  @Input() visible: boolean = true;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>(); 
  @Output() clickAdd: EventEmitter<any> = new EventEmitter<any>();
  client!: Client;
  clientFormGroup!: FormGroup;
  selectedFile!: File ; // Ajoutez cette ligne
  uploadProgress: number = 0;
  constructor(
    private fb:FormBuilder,
    private messageService:MessageService,
    private router: Router,
    private clientService:ClientsService,
    private http: HttpClient
  ){

  }
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.clientFormGroup = this.fb.group({
    nom: ['',[Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
    email: ['', [Validators.required, Validators.email]],
    tel: ['', [Validators.required]],
    logo: ['',[Validators.required, Validators.max(1000000), Validators.pattern('^.+\.(jpg|jpeg|png)$')]],
    });
  }

  closeModal(){
    this.clickClose.emit(true);
  }

  submitDetails(){
    //const clientData = { ...this.clientFormGroup.value, ...this.selectedFile };
    const formData = new FormData();
    formData.append('id',UUID.UUID());
  formData.append('nom', this.clientFormGroup.get('nom')?.value);
  formData.append('email', this.clientFormGroup.get('email')?.value);
  formData.append('tel', this.clientFormGroup.get('tel')?.value);
  if (this.selectedFile) {
    formData.append('logo', this.selectedFile, this.selectedFile.name);
  }

    this.clientService.addNewClient(formData).subscribe(
      response => {
        this.clickAdd.emit(response);
        this.clientFormGroup.reset();
        this.closeModal();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Register Successfully' });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      }
    );
  }
    

  onSelectFile(event:any){
    this.selectedFile  = event.target.files[0];
    console.log(this.selectedFile);
  }

  get nom(){
    return this.clientFormGroup.controls['nom'];
  }
   get email(){
    return this.clientFormGroup.controls['email'];
   }
   get tel(){
    return this.clientFormGroup.controls['tel'];
   }
   get logo(){
    return this.clientFormGroup.controls['logo'];
   }
}
