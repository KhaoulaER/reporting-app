import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { HomeAuditorService } from './home-auditor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home-auditor',
  templateUrl: './home-auditor.component.html',
  styleUrl: './home-auditor.component.css'
})
export class HomeAuditorComponent implements OnInit{

  totalAffectations:number = 0
  totalNVPro:number=0
  totalUnaudited:number=0
  errorMessage!:string;
  auditorId!:string;
  displayUnaudited:boolean=false;


  constructor(
    private authService:AuthenticationService,
    private homeAuditorService:HomeAuditorService,
    private router: Router,
    private route: ActivatedRoute,

  ){}
  ngOnInit(): void {
    this.auditorId = this.authService.authenticatedUser?.id || ''
    this.handleCountNonValidatedPro(this.auditorId);
    this.handleCountTotalAffectation(this.auditorId);
    this.handleCountUnaudited(this.auditorId)
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

  handleCountUnaudited(auditorId:string){
    this.homeAuditorService.countUnauditedProjects(auditorId).subscribe({
      next:(data)=>{
        console.log(data);
        this.totalUnaudited=data
      },
      error: (err)=>{
        this.errorMessage = `Erreur: ${err.message}`;
      }
    })
  }
  handleUnauditedProjects(){
    this.displayUnaudited=true;
  }
}
