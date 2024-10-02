import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { HomeManagerService } from './home-manager.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home-manager',
  templateUrl: './home-manager.component.html',
  styleUrl: './home-manager.component.css'
})
export class HomeManagerComponent implements OnInit{

  //totals
  totalPro:number=0;
  totalAudits:number=0;

  countPro:number=0;
  countAudits:number=0;
  

  errorMessage: string='';
  managerId!:string;
  displayProList:boolean=false;
  displayAuditList:boolean=false;

  constructor(
    private authService: AuthenticationService,
    private homeManagerService: HomeManagerService,
    private router: Router,
    private route: ActivatedRoute,

  ){}
  ngOnInit(): void {
      this.managerId = this.authService.authenticatedUser?.id || '';
      //console.log('manager id: ',this.managerId)
      if (this.managerId) {
        this.handleTotalProjects(this.managerId)
        this.handleGetCountProjects(this.managerId)
        this.handleGetCountAudits(this.managerId)
        this.handleTotalAudits(this.managerId)
      } else {
        // Gérer le cas où normeId est null
        console.error('managerId is null');
      }
     }

     ///////////////////////// PROJECTS /////////////////////

  handleTotalProjects(managerId:string){
    this.homeManagerService.countProjects(managerId).subscribe({
      next: (data)=>{
        console.log(data);
        this.totalPro=data
      },
      error: (err)=>{
        this.errorMessage = `Erreur: ${err.message}`;
      }
    })
  }   
  
  handleGetCountProjects(managerId:string){
    this.homeManagerService.getProjectsCount(managerId).subscribe({
      next: (data)=>{
        console.log(data);
        this.countPro=data;
      },
      error: (err)=>{
        this.errorMessage = `Erreur: ${err.message}`;
      }
    })
  }

  handleGetProjects(){
    this.displayAuditList=false
    this.displayProList=true
  }

/////////////////////////////// AUDITS //////////////////////

handleTotalAudits(managerId:string){
  this.homeManagerService.countAudits(managerId).subscribe({
    next: (data)=>{
      console.log(data)
      this.totalAudits=data
    },
    error: (err)=>{
      this.errorMessage = `Erreur: ${err.message}`;
    }
  })
}


  handleGetCountAudits(managerId:string){
    this.homeManagerService.getAuditsCount(managerId).subscribe({
      next: (data)=>{
        console.log(data);
        this.countAudits=data;
      },
      error: (err)=>{
        this.errorMessage = `Erreur: ${err.message}`;
      }
    })
  }

  handleGetAudits(){
    this.displayProList=false
    this.displayAuditList=true;
  }

}
