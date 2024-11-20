import { Component, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  @Output() logout:EventEmitter<any>=new EventEmitter<any>();
  constructor(
    public authService:AuthenticationService,
    public messageService:MessageService,
    public confirmationService: ConfirmationService,
    public route:ActivatedRoute,
    public router:Router,
    public tokenStorage:TokenStorageService){}

  
  handleLogOut() {
    console.log("Logout triggered"); // Debugging step

    this.confirmationService.confirm({
        message: 'Voulez-vous vraiment vous déconnecter ?',
        header: 'Confirmer la déconnexion',
        icon: 'pi pi-info-circle',
        rejectButtonStyleClass: "p-button-danger p-button-text",
        acceptButtonStyleClass: "p-button-text p-button-text",
        acceptIcon: "none",
        rejectIcon: "none",

        accept: () => {
            console.log("Accepted"); // Debugging step
            this.logout.emit(this.tokenStorage.signOut())
            this.router.navigateByUrl('/auth/login');
            this.messageService.add({ severity: 'success', summary: 'Déconnecté' });
        },
        reject: () => {
            console.log("Rejected"); // Debugging step
        }
    });
}

}
