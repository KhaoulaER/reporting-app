import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NormeAdopte } from '../../projets/model/projet';
import { Chapitre } from '../../normes/model/norme';
import { AuditService } from '../audit.service';
import { ActivatedRoute } from '@angular/router';
import { ConformiteService } from './conformite.service';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { UIChart } from 'primeng/chart';
@Component({
  selector: 'app-conformite',
  templateUrl: './conformite.component.html',
  styleUrl: './conformite.component.css'
})
export class ConformiteComponent implements OnInit{
  @Output() chartImageCaptured: EventEmitter<string> = new EventEmitter<string>(); // Output for the parent component
  @ViewChild('chart') myChart: UIChart | undefined; // Access PrimeNG chart component

  niveauMaturite: string[] = ['Aucun', 'Initial', 'Reproductible', 'Défini', 'Maîtrisé', 'Optimisé'];
  niveauT = ['Non_conforme','Partielle','Totale']

  normeAdopte!: NormeAdopte;
  chapitres!: Chapitre[];
  errorMessage!: string;
  normeId!: string;
  results: any[] = [];
  conformiteVisible=false;
  conformiteVisible$ = this.conformiteService.conformiteVisible$;
  conformiteNorme!:number;
  acc:number = 0;
  av!:any;
  nvCible:number=80;
  // Configuration du radar chart pour PrimeNG
  public radarChartOptions: any;
  public radarChartData: any;
  showChartModal:boolean=false;

  constructor(
    private auditService: AuditService,
    private conformiteService: ConformiteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.normeId = this.route.snapshot.paramMap.get('normeId')!;
    this.loadChapitres()
    this.conformiteService.conformiteVisible$.subscribe(visible => {
      this.conformiteVisible = visible;
    });
    this.auditService.findTotalNiveau(this.normeId)
    .subscribe((data: any[]) => {
      this.results = data;
      console.log('nb res: ',this.results.length)
      console.log('normeAdopte norme echel:', this.normeAdopte);  // Add this line
      //this.conformiteNorme=this.getConformite()
      for(let el in this.results){
        console.log('premier elem:',this.results[el].conformite)
        this.acc=this.acc+this.results[el].conformite
      }
      
      console.log('cumule:',this.acc)
      this.av=(this.acc/this.results.length).toFixed(2)
      this.conformiteNorme=this.av;
      
      // Préparer les données pour le radar chart
      const labels = this.results.map(res => res.chapitre);
      const dataValues = this.results.map(res => res.conformite * 100);

      // Données du radar chart
      this.radarChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Conformité actuelle',
            data: dataValues,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
          },
          {
            label: 'Conformité cible',
            data: Array(this.results.length).fill(this.nvCible), // Remplir le tableau avec 80 pour tous les chapitres
            backgroundColor: 'rgba(0, 128, 0, 0.2)',
            borderColor: 'rgba(0, 128, 0, 1)',
            pointBackgroundColor: 'rgba(0, 128, 0, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 128, 0, 1)'
          }
        ]
      };

      // Options du radar chart
      this.radarChartOptions = {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 100 // Pourcentage
          }
        }
      };
  
      
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

  /*captureChartImage(): void {
    const chartInstance = this.myChart?.chart;
    if (chartInstance) {
      const chartCanvas = chartInstance.canvas;
      const imageUrl = chartCanvas.toDataURL('image/png');
      this.chartImageCaptured.emit(imageUrl); // Emit captured image
    } else {
      this.chartImageCaptured.emit(''); // Emit empty if no chart
    }
  }*/

  showChart(){
    this.showChartModal=true
  }

  
  
  
}
