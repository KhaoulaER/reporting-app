import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    managerId:string = '57d1c5dc-887b-3029-19e2-e8ad80a48ce6'

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
         }
         else if (urlPath.includes('home-auditor')) {
            this.updateMenu('AUDITOR');
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
                        { label: 'Chefs des projets', icon: 'pi pi-fw pi-users', routerLink: ['/home-admin/users', 'PROJECT_MANAGER'] }
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
                {
                    label: 'Projets',
                    items: [
                        {
                            label: 'Mes projets', icon: 'pi pi-fw pi-clipboard', routerLink: ['/home-manager/projects', this.managerId]                        }
                    ]
                }
               
                
            ];
        }
        else if(role === 'AUDITOR'){
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/home-auditor'] }
                    ]
                },
                {
                    label: 'Projets',
                    items: [
                        { label: 'Projets', icon: 'pi pi-fw pi-clipboard', routerLink: ['/home-auditor/projets-audit'] },
                    ]
                },
               
                
            ];
        }
    }
}
