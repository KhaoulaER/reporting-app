import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NormesService } from '../../../normes.service';
import { Norme } from '../../../model/norme';

@Component({
  selector: 'app-norme-update',
  templateUrl: './norme-update.component.html',
  styleUrl: './norme-update.component.css'
})
export class NormeUpdateComponent implements OnChanges{
  @Input() display: boolean = true;
  @Input() selectedNorm: any = null;
  echels: string[] = ['0->3','0->5']
  @Output() clickCloseMod: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddMod: EventEmitter<any> = new EventEmitter<any>();
  constructor(private fb: FormBuilder,
    private messageService:MessageService,
    private normeService:NormesService
  ){}
  ngOnChanges(): void {
    if(this.selectedNorm){
      this.updateForm.patchValue(this.selectedNorm);
    }else{
      this.updateForm.reset();
    }
  }

  updateForm = this.fb.group({
    designation: ['',[Validators.required]],
    echel: ['',[Validators.required]]
  });

  closeModal(){
    this.clickCloseMod.emit(true);
  }

  handleSubmit(){
    const updatedData=this.updateForm.value;
    this.normeService.updateNorme(updatedData as Norme, this.selectedNorm).subscribe(
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
  get echel(){
    return this.updateForm.controls['echel'];
  }



}
