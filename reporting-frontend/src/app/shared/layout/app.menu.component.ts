import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private route: ActivatedRoute,
        private router:Router
    ) { }

    ngOnInit() {
         // Vérifiez l'URL actuelle
         const urlPath = this.router.url;

         // Ajustez le menu en fonction de l'URL
         if (urlPath.includes('home-manager')) {
             this.updateMenu('PROJECT MANAGER');
         } else if (urlPath.includes('home-admin')) {
             this.updateMenu('ADMIN');
         } else {
             this.updateMenu('DEFAULT');
         }
        
    }
    updateMenu(role:string){
        if(role === 'ADMIN'){
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/home-admin'] }
                    ]
                },
                {
                    label: 'Utilisateurs',
                    items: [
                        { label: 'Admins', icon: 'pi pi-fw pi-users', routerLink: ['/home-admin/users', 'ADMIN'] },
                        { label: 'Auditeurs', icon: 'pi pi-fw pi-users', routerLink: ['/home-admin/users', 'AUDITOR'] },
                        { label: 'Chefs des projets', icon: 'pi pi-fw pi-users', routerLink: ['/home-admin/users', 'PROJECT MANAGER'] }
                    ]
                },
                {
                    label: 'Normes',
                    items: [
                        { label: 'Normes', icon: 'pi pi-fw pi-clipboard', routerLink: ['/home-admin/norms'] },
                    ]
                }
            ];
        }
        else if(role === 'PROJECT MANAGER'){
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/home-manager'] }
                    ]
                },
                {
                    label: 'Clients',
                    items: [
                        { label: 'Clients', icon: 'pi pi-fw pi-clipboard', routerLink: ['/home-manager/clients'] },
                    ]
                },
               
                
            ];
        }
    }
}
