import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../user.service';
import { MessageService } from 'primeng/api';
import { User } from '../../../model/user';
import { EventEmitter } from '@angular/core';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent implements OnChanges {
  @Input() visible: boolean = true;
  @Input() selectedUser : any = null;

  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAdd : EventEmitter<any> = new EventEmitter<any>();
  updateForm = this.fb.group({
    firstName: ['',[Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
    lastName: ['',[Validators.required,Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
    email: ['', [Validators.required,Validators.email]],
    phone: ['', [Validators.required,]],
  })

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private messageService:MessageService
  ){

  }
  ngOnChanges(): void {
    if(this.selectedUser){
      this.updateForm.patchValue(this.selectedUser);
    }else{
      this.updateForm.reset();
    }
  }

  closeModal(){
    this.clickClose.emit(true);
  }

  handleSubmit(){
    const updatedData=this.updateForm.value;
    this.userService.updateUser(updatedData as User, this.selectedUser).subscribe(
      response => {
        this.clickAdd.emit(response);
        this.closeModal();
        console.log(response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Updated Successfully' });
      },
      error =>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        console.log('Error occured');
      }
    )
  }
 


  get firstName(){
    return this.updateForm.controls['firstName'];
  }
  get lastName(){
    return this.updateForm.controls['lastName'];
  }
   get email(){
    return this.updateForm.controls['email'];
   }
   
   get phone(){
    return this.updateForm.controls['phone'];
   }
   
}
