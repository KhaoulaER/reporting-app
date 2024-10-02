import { Component, OnInit } from '@angular/core';
import { Role, User } from '../../model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { passwordMatchValidator } from '../../../../shared/password-match.directive';
import { UserService } from '../../user.service';
import { File } from 'buffer';


@Component({
  selector: '.app-user-add',
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent implements OnInit{

  user!: User;
  groups = Object.keys(Role);
  userFormGroup!: FormGroup;
  selectedFile = null;
  constructor(
    private fb:FormBuilder,
    private messageService:MessageService,
    private router: Router,
    private userService: UserService
  ){
    this.createForm();
  }
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.userFormGroup = this.fb.group({
    firstName: ['',[Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
    lastName: ['',[Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    password: ['',[Validators.required]],
    confirmPassword: ['',[Validators.required]],
    //photo: ['',[Validators.required, Validators.max(1000000), Validators.pattern('^.+\.(jpg|jpeg|png)$')]],
    group: ['',[Validators.required]]
    },{
      validators: passwordMatchValidator
    });
  }

 /*url="../../../assets/images/";
   onselectFile(event:any){
    this.selectedFile = event.target.files[0];
   }
*/
  submitDetails(){
    const postData={ ...this.userFormGroup.value, groups: [`/${this.userFormGroup.value.group}`]};
    this.userService.addNewUser(postData as User).subscribe(
      response => {
        //console.log(response);
        this.userFormGroup.reset();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Register Successfully' });
        //this.router.navigate(['']);  
        this.ngOnInit();
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });

      }
    )
  }

  

  get firstName(){
    return this.userFormGroup.controls['firstName'];
  }
  get lastName(){
    return this.userFormGroup.controls['lastName'];
  }
   get email(){
    return this.userFormGroup.controls['email'];
   }
   get password(){
    return this.userFormGroup.controls['password'];
   }
   get confirmPassword(){
    return this.userFormGroup.controls['confirmPassword'];
   }
   get phone(){
    return this.userFormGroup.controls['phone'];
   }
   /*get photo(){
    return this.userFormGroup.controls['photo'];
   }*/
   get group(){
    return this.userFormGroup.controls['group'];
   }
}
