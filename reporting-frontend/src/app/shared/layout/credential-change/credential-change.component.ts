import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../password-match.directive';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../../core/authentication/authentication.service';

@Component({
  selector: 'app-credential-change',
  templateUrl: './credential-change.component.html',
  styleUrl: './credential-change.component.css'
})
export class CredentialChangeComponent{
  @Input() visible:boolean=true;
  @Output() clickAdd:EventEmitter<any>= new EventEmitter<any>()
 
  pwdFormGroup = this.fb.group({
    password: ['',[Validators.required, Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    confirmPassword: ['',[Validators.required]],
  },
  {
    validators: passwordMatchValidator
  })

  constructor(
    private fb:FormBuilder, 
    private messageService:MessageService,
    private authService: AuthenticationService // Service to handle the password update

    ){

  }
  

  submitDetails() {
    if (this.pwdFormGroup.valid) {
      const newPassword = this.pwdFormGroup.get('password')?.value;
      
      if (newPassword) {
        this.authService.changePassword(newPassword).subscribe(/*{
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Mot de passe mis à jour' });
            this.visible = false; // Close the dialog after success
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la mise à jour du mot de passe' });
          }
         
        }*/
          response => {
            this.clickAdd.emit(response);
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Mot de passe mis à jour' });
            this.visible = false; 
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la mise à jour du mot de passe' });
          }
        );
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Le mot de passe est requis' });
      }
    }
  }
  

  get password() {
    return this.pwdFormGroup.get('password');
  }
  
  get confirmPassword() {
    return this.pwdFormGroup.get('confirmPassword');
  }
}
