import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit{
    public visible:boolean=false;


    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    public fullName: string | undefined;
    public lastName: string | undefined;
    public email: string | undefined;

    constructor(public layoutService: LayoutService,public authService:AuthenticationService,
        public messageService:MessageService,
        public confirmationService: ConfirmationService,
        public route:ActivatedRoute,
        public router:Router,
        public tokenStorage:TokenStorageService,
        public translate: TranslateService
    ) {
        this.fullName = authService.authenticatedUser?.fullName;
        this.lastName = authService.authenticatedUser?.lastName;
        this.email = authService.authenticatedUser?.email;
        //console.log("authenticated: ",this.email)
     }
    ngOnInit(): void {
        const lang = localStorage.getItem('language') || 'fr';
        this.translate.use(lang);
    }
    

     handleChangePwd(){
        this.visible=true
      }

      onUpdate(response: any) {
        if (response) {
            // Display success message and any other necessary logic
            
            // Optionally hide the password change dialog
            this.visible = false;
        } 
    }
    
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
                this.tokenStorage.signOut();
                this.router.navigateByUrl('/auth/login');
                this.messageService.add({ severity: 'success', summary: 'Déconnecté' });
            },
            reject: () => {
                console.log("Rejected"); // Debugging step
            }
        });
    }
    
    switchLanguage(lang: string) {
        this.translate.use(lang);
        localStorage.setItem('language', lang);
      }
    
    
}
