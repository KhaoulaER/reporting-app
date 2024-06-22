import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PointsControleService } from '../../../points-controle.service';
import { PointsControle } from '../../../../../model/norme';

@Component({
  selector: 'app-points-controle-update',
  templateUrl: './points-controle-update.component.html',
  styleUrl: './points-controle-update.component.css'
})
export class PointsControleUpdateComponent implements OnChanges{
  @Input() display: boolean = true;
  @Input() selectedPc: any = null;

  @Output() clickCloseMod: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddMod: EventEmitter<any> = new EventEmitter<any>();
  constructor(private fb: FormBuilder,
    private messageService:MessageService,
    private pcService:PointsControleService
  ){}

  updateForm = this.fb.group({
    designation: ['',[Validators.required]],
    objectif:['',[Validators.required]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if(this.selectedPc){
      this.updateForm.patchValue(this.selectedPc);
    }else{
      this.updateForm.reset();
    }
  }

  closeModal(){
    this.clickCloseMod.emit(true);
  }

  handleSubmit(){
    const updatedData=this.updateForm.value;
    this.pcService.updatePc(updatedData as PointsControle, this.selectedPc).subscribe(
      response => {
        this.clickAddMod.emit(response);
        this.clickCloseMod.emit(true);
        console.log(response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Norme modifiée' });

      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        console.log('Error occured');
      }
    )
  }

  get designation(){
    return this.updateForm.controls['designation'];
  }
  get objectif(){
    return this.updateForm.controls['objectif'];
  }
}
