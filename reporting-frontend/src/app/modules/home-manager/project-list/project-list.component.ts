import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { HomeManagerService } from '../home-manager.service';
import { NormeAdopte } from '../../projets/model/projet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit{

  @Input() displayProList:boolean = true;
  proDetails!:any[];
  errorMessage!:string;
  managerId!:string;
  selectedNorme!:NormeAdopte;
  constructor(
    private authService:AuthenticationService,
    private homeManagerService:HomeManagerService,
    private router: Router

  ){}
  ngOnInit(): void {
    this.managerId = this.authService.authenticatedUser?.id || '';
      console.log('manager id: ',this.managerId)
      if (this.managerId) {
        this.loadProjectDetails(this.managerId)
      }
  }

  loadProjectDetails(managerId: string) {
    this.homeManagerService.getProjects(managerId).subscribe({
      next: (data) => {
        console.log(data);
        this.proDetails = data;
        this.proDetails.forEach(pro => {
          if (pro.normeAdopte && pro.normeAdopte.length > 0) {
            pro.selectedNorme = pro.normeAdopte[0]; // Set first norme by default
          } else {
            pro.selectedNorme = null; // Handle case where no norme is available
          }
        });
      },
      error: (err) => {
        this.errorMessage = `Erreur: ${err.message}`;
      }
    });
  }
  

  onconsult(normeAdopte: NormeAdopte | null): void {
    if (normeAdopte && normeAdopte.id) {
      console.log('norm id', normeAdopte.id);
      this.router.navigate(['/home-manager/audit-manager', normeAdopte.id]);
    } else {
      console.error('Norme adoptée non valide ou inexistante');
    }
  }
}
