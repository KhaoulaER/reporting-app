import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PointsControleService } from '../../points-controle.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { _ } from 'ag-grid-community';
import { PointsControle } from '../../../../model/norme';

@Component({
  selector: 'app-points-controle-add',
  templateUrl: './points-controle-add.component.html',
  styleUrl: './points-controle-add.component.css'
})
export class PointsControleAddComponent {
  @Input() showAddForm: boolean = true;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAdd: EventEmitter<any> = new EventEmitter<any>();
  chapitreId: string ='';
  
  addPcForm=this.fb.group({
    designation:['',[Validators.required]],
    objectif:['',[Validators.required]]
  });
  constructor(
    private fb:FormBuilder, 
    private pcService:PointsControleService,
    private messageService:MessageService,
    private route:ActivatedRoute
  ){

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chapitreId = params.get('chapitreId') || '';
    });
  }

  closeForm(){
    this.clickClose.emit(true);
  }

  handleAddPc(){
    const postData={...this.addPcForm.value};
    this.pcService.addNewPc(postData as PointsControle,this.chapitreId).subscribe(
      response => {
        this.clickAdd.emit(response);
        this.addPcForm.reset();
        this.clickClose.emit(true);
        this.messageService.add({severity:'success', summary:'Success', detail: 'Chaptre enregistre'});
      },
      error => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Echec d enregistrement'});
      }
      
    )
  }

  get designation(){
    return this.addPcForm.controls['designation'];
  }
  get objectif(){
    return this.addPcForm.controls['objectif'];
  }
  

}
