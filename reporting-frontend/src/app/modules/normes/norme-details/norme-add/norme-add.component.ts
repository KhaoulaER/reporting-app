import { Component, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NormesService } from '../../normes.service';
import { MessageService } from 'primeng/api';
import { Norme } from '../../model/norme';
import { EventEmitter } from '@angular/core'; 


@Component({
  selector: 'app-norme-add',
  templateUrl: './norme-add.component.html',
  styleUrl: './norme-add.component.css'
})
export class NormeAddComponent {

  echels: string[] = ['0->3','0->5']

  @Input() visible: boolean = true;

  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>(); 
  @Output() clickAdd: EventEmitter<any> = new EventEmitter<any>();
  addNormForm = this.fb.group({
    designation: ['',[Validators.required]],
    echel: ['',[Validators.required]]
  });


  constructor(private fb: FormBuilder,
    private normeService:NormesService,
    private messageService: MessageService
  ){}

  closeModal(){
    this.clickClose.emit(true);
  }


  handleAddNorm(){
    const postData={...this.addNormForm.value};
    this.normeService.addNewNorm(postData as Norme).subscribe(
      response => {
        this.clickAdd.emit(response);
        this.addNormForm.reset();
        this.closeModal();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Register Successfully' });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });

      }
    )

  }

  get designation(){
    return this.addNormForm.controls['designation'];
  }
  get echel(){
    return this.addNormForm.controls['echel'];
  }
}
