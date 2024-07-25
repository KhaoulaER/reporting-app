import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Projet } from './model/projet';

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrl: './projets.component.css'
})
export class ProjetsComponent implements OnInit{
  visible: boolean = false;
  managerId:string='';
  projets:Projet[]=[];
  constructor(
    private route:ActivatedRoute
  ){}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.managerId = params.get('managerId') || '';
    });
  }

  saveProjet(newData:any): void{
    this.projets.unshift(newData)
  }
  onCancel(event:any){
    
  }
  showAddModal(event:any){
    this.visible=true;
  }

}
