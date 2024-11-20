import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Projet } from './model/projet';
import { ProjetService } from './projet.service';

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrl: './projets.component.css'
})
export class ProjetsComponent implements OnInit{
  visible: boolean = false;
  managerId:string='';
  projets:Projet[]=[];
  errorMessage!:string;
  constructor(
    private route:ActivatedRoute,
    private projetService:ProjetService
  ){}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.managerId = params.get('managerId') || '';
    });
    this.loadProjet();
  }

  
  loadProjet(): void{
    this.projetService.findAllByManagers(this.managerId).subscribe({
      next: (data)=>{
        console.log(data);
        this.projets=data;  
      },
      error: (err)=>{
        this.errorMessage = `Fqiled to load projects: ${err.message}`
      }
    })
  }

  saveProjet(newData:any): void{
      this.projets.unshift(newData)
      this.visible = false;    

  }
  onCancel(){
    this.visible=false;
        this.loadProjet();
  }
  showAddModal(event:any){
    this.visible=true;
  }

}
