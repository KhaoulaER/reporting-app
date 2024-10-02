import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Projet } from '../../model/projet';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProjetService } from '../../projet.service';

@Component({
  selector: 'app-projet-norme',
  templateUrl: './projet-norme.component.html',
  styleUrl: './projet-norme.component.css'
})
export class ProjetNormeComponent implements OnInit{
  @Input() showModal:boolean=true;
  @Input() selectedProjet!:Projet;
  
 // @Output() clickChoose: EventEmitter<any>=new EventEmitter<any>()
  selectedNormeAdopte:any;
  normesAdoptees:any[]=[];
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private projetService:ProjetService,
    private messageService: MessageService
  ){}
  ngOnInit(): void {
    
    this.projetService.findNormeAdopte(this.selectedProjet).subscribe(
      data=>{
        console.log('data:', data)
        this.normesAdoptees=data
      }
    )
    this.normesAdoptees=this.selectedProjet.normeAdopte 
    console.log('na: ',this.normesAdoptees)
  }

  redirectToAudit(): void {
    if (this.selectedNormeAdopte) {
      this.router.navigate([`/home-manager/audit-manager/${this.selectedNormeAdopte.id}`]);
      this.showModal = false;

    } else {
      this.messageService.add({ severity: 'warn', summary: 'Avertissement', detail: 'Veuillez sélectionner une norme adoptée' });
    }
  }

}
