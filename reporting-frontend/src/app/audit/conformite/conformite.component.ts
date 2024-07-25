import { Component, OnInit } from '@angular/core';
import { NormeAdopte } from '../../projets/model/projet';
import { Chapitre } from '../../normes/model/norme';
import { AuditService } from '../audit.service';
import { ActivatedRoute } from '@angular/router';
import { ConformiteService } from './conformite.service';

@Component({
  selector: 'app-conformite',
  templateUrl: './conformite.component.html',
  styleUrl: './conformite.component.css'
})
export class ConformiteComponent implements OnInit{
  niveauMaturite: string[] = ['Aucun', 'Initial', 'Reproductible', 'Défini', 'Maîtrisé', 'Optimisé'];

  normeAdopte!: NormeAdopte;
  chapitres!: Chapitre[];
  errorMessage!: string;
  normeId!: string;
  results: any[] = [];
  conformiteVisible=false;
  conformiteVisible$ = this.conformiteService.conformiteVisible$;
  conformiteNorme!:number;
  acc:number = 0;


  constructor(
    private auditService: AuditService,
    private conformiteService: ConformiteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.normeId = this.route.snapshot.paramMap.get('normeId')!;
    this.conformiteService.conformiteVisible$.subscribe(visible => {
      this.conformiteVisible = visible;
    });
    this.auditService.findTotalNiveau(this.normeId)
    .subscribe((data: any[]) => {
      this.results = data;
      console.log('nb res: ',this.results.length)
      //this.conformiteNorme=this.getConformite()
      for(let el in this.results){
        console.log('premier elem:',this.results[el].conformite)
        this.acc=this.acc+this.results[el].conformite
      }
      
      console.log('cumule:',this.acc)
      this.conformiteNorme=this.acc/this.results.length;
      console.log('conformite de norme: ',this.conformiteNorme)
      console.log('Conformite',this.results)
    }, error => {
      console.error('Error fetching audits', error);
    });
    
  }

  loadChapitres(): void {
    this.auditService.findNCP(this.normeId).subscribe({
      next: (data) => {
        this.normeAdopte = data.nms[0];
        this.chapitres = data.nms[0].norme.chapitre;
      },
      error: (err) => {
        this.errorMessage = `Failed to load chapitres`;
      }
    });
  }
  
  

  getAudits(): void {
   
  }

  

}
