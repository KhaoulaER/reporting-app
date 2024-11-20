import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Client } from '../../clients/model/clients';
import { ClientsService } from '../../clients/clients.service';
import { ProjetService } from '../projet.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Norme } from '../../normes/model/norme';
import { NormesService } from '../../normes/normes.service';
import { NormeAdopte, Projet } from '../model/projet';
import { UUID } from 'angular2-uuid';
import { User } from '../../user/model/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-projet-add',
  templateUrl: './projet-add.component.html',
  styleUrl: './projet-add.component.css'
})
export class ProjetAddComponent implements OnInit{
  


  @Input() visible: boolean = false;
  @Output() clickClose: EventEmitter<boolean>=new EventEmitter<boolean>();
  @Output() clickAdd: EventEmitter<any>=new EventEmitter<any>();
  projetForm: FormGroup;
  clients: any[] = [];
  normes: any[] = [];
  managerId:string=''

  constructor(
    private fb: FormBuilder, 
    private projetService: ProjetService,
    private clientService: ClientsService,
    private normeService: NormesService,
    private route: ActivatedRoute
  ) {
    this.projetForm = this.fb.group({
      designation: ['', Validators.required],
      client: ['', Validators.required],
      //projectManagerId: ['', Validators.required],
      normeIds: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.managerId = params.get('managerId') || '';
      
    });
    this.clientService.findAll().subscribe(data => {
      this.clients = data;
    });
    this.normeService.findAll().subscribe(data => {
      this.normes = data
    })
    console.log('clients: ', this.clients)
  }

  onCheckboxChange(e: any) {
    const normeIds: FormArray = this.projetForm.get('normeIds') as FormArray;

    if (e.target.checked) {
      normeIds.push(new FormControl(e.target.value));
    } else {
      const index = normeIds.controls.findIndex((ctrl: AbstractControl) => ctrl.value === e.target.value);
      if (index !== -1) {
        normeIds.removeAt(index);
      }
    }
  }

  onSubmit() {
    if (this.projetForm.valid) {
      const formValue = this.projetForm.value;
      const client = this.clients.find(c => c.id === formValue.client);
      const projetData = {
        designation: formValue.designation,
        client: client,
        normeIds: formValue.normeIds,
        projectManagerId: this.managerId
      };

      this.projetService.createProjet(this.managerId,projetData as unknown as Projet).subscribe(response => {
        this.clickAdd.emit(response);
        console.log('Projet créé avec succès', response);
        this.visible = false;
      });
    }
  }

  onDialogHide(): void {
    this.projetForm.reset()
    this.clickClose.emit(true);
  }
}
