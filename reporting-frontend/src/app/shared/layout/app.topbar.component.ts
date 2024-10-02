import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    public visible:boolean=false;


    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    public firstName: string | undefined;
    public lastName: string | undefined;
    public email: string | undefined;

    constructor(public layoutService: LayoutService,public authService:AuthenticationService,
        public messageService:MessageService,
        public route:ActivatedRoute,
        public router:Router,
        public tokenStorage:TokenStorageService
    ) {
        this.firstName = authService.authenticatedUser?.firstName;
        this.lastName = authService.authenticatedUser?.lastName;
        this.email = authService.authenticatedUser?.email;
        //console.log("authenticated: ",this.email)
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

    handleLogOut(){
        this.tokenStorage.signOut()

        this.router.navigateByUrl('/auth/login')
        this.messageService.add({ severity: '', summary: 'Déconnecté'});
    }
}
