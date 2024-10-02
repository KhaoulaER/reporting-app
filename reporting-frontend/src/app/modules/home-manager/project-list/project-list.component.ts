import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { HomeManagerService } from '../home-manager.service';

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
  constructor(
    private authService:AuthenticationService,
    private homeManagerService:HomeManagerService
  ){}
  ngOnInit(): void {
    this.managerId = this.authService.authenticatedUser?.id || '';
      console.log('manager id: ',this.managerId)
      if (this.managerId) {
        this.loadProjectDetails(this.managerId)
      }
  }

  loadProjectDetails(managerId:string){
    this.homeManagerService.getProjects(managerId).subscribe({
      next: (data)=>{
        console.log(data)
        this.proDetails=data
      },
      error: (err)=>{
        this.errorMessage = `Erreur: ${err.message}`;
      }
    })
  }
}
