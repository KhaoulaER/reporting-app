import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { HomeAuditorService } from './home-auditor.service';

@Component({
  selector: 'app-home-auditor',
  templateUrl: './home-auditor.component.html',
  styleUrl: './home-auditor.component.css'
})
export class HomeAuditorComponent implements OnInit{

  totalAffectations:number = 0
  totalNVPro:number=0
  errorMessage!:string;
  auditorId!:string;

  constructor(
    private authService:AuthenticationService,
    private homeAuditorService:HomeAuditorService
  ){}
  ngOnInit(): void {
    this.auditorId = this.authService.authenticatedUser?.id || ''
    this.handleCountNonValidatedPro(this.auditorId);
    this.handleCountTotalAffectation(this.auditorId);
  }

  handleCountTotalAffectation(auditorId:string){
    this.homeAuditorService.countTotalProjets(auditorId).subscribe({
      next: (data)=>{
        console.log(data)
        this.totalAffectations=data
      },
      error:(err)=>{
        this.errorMessage = `Erreur: ${err.message}`;
      }
    })
  }

  handleCountNonValidatedPro(auditorId:string){
    this.homeAuditorService.countNonValidatedProjects(auditorId).subscribe({
      next: (data)=>{
        console.log(data)
        this.totalNVPro=data
      },
      error:(err)=>{
        this.errorMessage = `Erreur: ${err.message}`;
      }
    })
  }

}
