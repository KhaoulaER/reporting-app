import { Component, OnInit } from '@angular/core';
import { NormeAdopte, Projet } from '../model/projet';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjetService } from '../projet.service';

@Component({
  selector: 'app-projet-list',
  templateUrl: './projet-list.component.html',
  styleUrl: './projet-list.component.css'
})
export class ProjetListComponent implements OnInit{
  projets !: Projet[]
  errorMessage!: string;
  visible: boolean = false;
  display: boolean = false;
  managerId!:string;
  showModal:boolean = false;
  selectedProjet!:Projet;
  selectedNormeAdopte!: any;
  normesAdoptees: any[] = [];
  displayAuditModal: boolean = false;
  //GESTION DES AFFECTATIONS
  showAuditors:boolean=false;
  selectedPro!:Projet;

  constructor(
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private projetService: ProjetService,
    private router: Router
  ){}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.managerId = params.get('managerId') || '';
      if (this.managerId) {
        this.loadProjet();
      } else {
        // Gérer le cas où normeId est null
        console.error('managerId is null');
      }
    });

    
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

  handleDeleteProjet(projet: Projet){

  }

  handleEditProjet(projet: Projet){

  }

  showAddModal(event:any){

  }
  /*showAuditModal(projet:Projet){
    this.showModal=true
    this.selectedProjet=projet;
  }
  goAudit(){

  }*/
  showAuditModal(projet: Projet): void {
    this.selectedProjet = projet;
    console.log('selected pro: ', this.selectedProjet)
    //this.normesAdoptees = projet.normeAdopte || []; // Charger les normes adoptées du projet
    this.projetService.findNormeAdopte(this.selectedProjet).subscribe(data=>{
      console.log('data:',data)
      this.normesAdoptees=data
      console.log('Normes adoptées par le projet sélectionné :', this.normesAdoptees); // Affichez les normes adoptées sur la console

    })
    this.displayAuditModal = true;

  }

  redirectToAudit(): void {
    if (this.selectedNormeAdopte) {
      this.router.navigate([`/home-manager/audit-manager/${this.selectedNormeAdopte.id}`]);
      this.displayAuditModal = false;
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Avertissement', detail: 'Veuillez sélectionner une norme adoptée' });
    }
  }


  //GESTION DES AFFECTATIONS
  handleAffectation(projet:Projet){
    this.selectedPro=projet;
    this.showAuditors=true;
  }
}
