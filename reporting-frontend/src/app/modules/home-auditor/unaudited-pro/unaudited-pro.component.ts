import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { HomeAuditorService } from '../home-auditor.service';
import { NormeAdopte } from '../../projets/model/projet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unaudited-pro',
  templateUrl: './unaudited-pro.component.html',
  styleUrl: './unaudited-pro.component.css'
})
export class UnauditedProComponent implements OnInit {
  @Input() displayUnaudited: boolean = true;
  proDetails!:any[]
  errorMessage!:string;
  auditorId!:string;
  selectedNorme!:NormeAdopte;

  constructor(
    private authService:AuthenticationService,
    private homeAuditorService:HomeAuditorService,
    private router: Router
  ){}
  ngOnInit(): void {
    this.auditorId = this.authService.authenticatedUser?.id || ''
    if(this.auditorId){
      this.loadProjectsDetails(this.auditorId)

    }

  }

  loadProjectsDetails(auditorId:string){
    this.homeAuditorService.UnauditedProjects(auditorId).subscribe({
      next: (data)=>{
        console.log(data);
        this.proDetails=data;
       
      this.proDetails.forEach(pro => {
        if (pro.projet.normeAdopte && pro.projet.normeAdopte.length > 0) {
          pro.projet.selectedNormeAdopte = pro.projet.normeAdopte[0];
        }
      });
      },
      error: (err)=>{
        this.errorMessage= `Erreur: ${err.message}`;
      }
    })
  }


  onconsult(normeAdopte: NormeAdopte): void {
    if (normeAdopte && normeAdopte.id) {
      this.router.navigate(['/home-auditor/audit', normeAdopte.id]);
    } else {
      console.error('Norme adoptée non valide avec cet id:', normeAdopte.id);
    }
  }
}
