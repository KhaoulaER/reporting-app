import { Component, OnInit } from '@angular/core';
import {User} from '../../user/model/user'
import { Affectation, NormeAdopte, Projet } from '../../projets/model/projet';
import { ProjetAuditService } from '../projet-audit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Norme } from '../../normes/model/norme';
import { SlicePipe } from '@angular/common';
@Component({
  selector: 'app-projet-audit-list',
  templateUrl: './projet-audit-list.component.html',
  styleUrl: './projet-audit-list.component.css'
})
export class ProjetAuditListComponent implements OnInit{
  projets!: any[];
  affectations:any[]=[];
  normes!: Norme[];
  normeAdoptes!: NormeAdopte[];
  projet: any = null;
  selectedNorme!:NormeAdopte;
  errorMessage!:string;
  constructor(
    private projetAuditService:ProjetAuditService,
    private route: ActivatedRoute,
    private router: Router
  ){}
  ngOnInit(): void {
    
    this.normeAdoptes = [];
    this.getAffectations()
    this.affectations.forEach(affectation => affectation.projet.selectedNormeAdopte = affectation.projet.normeAdopte[0]// Initialisez avec une valeur par défaut
    )
    
  }

  getAffectations(): void {
    const auditeurId = '28f5df5a-101b-a3ea-bd95-577747746e55'; // Remplacez par l'ID de l'auditeur
    this.projetAuditService.findByAuditeur(auditeurId).subscribe(data => {
      this.affectations = data;
    }, error => {
      console.error('Erreur lors de la récupération des affectations:', error);
    });
  }

  onAudit(normeAdopte: NormeAdopte): void {
    if (normeAdopte && normeAdopte.id) {
      this.router.navigate(['/home-auditor/audit', normeAdopte.id]);
    } else {
      console.error('Norme adoptée non valide avec cet id:', normeAdopte.id);
    }
  }

  onNormeChange(affectation: Affectation, event: any): void {
    // Assurez-vous que event.value est un objet NormeAdopte
    if (event.value && event.value.id) {
      affectation.projet.normeAdopte = event.value;
      console.log('Norme changed:', affectation.projet.normeAdopte);
    }
  }

  
  

}