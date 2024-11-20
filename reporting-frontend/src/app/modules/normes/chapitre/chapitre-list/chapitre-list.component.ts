import { Component, OnInit } from '@angular/core';
import { ChapitreService } from '../chapitre.service';
import { ActivatedRoute } from '@angular/router';
import { Chapitre, Norme } from '../../model/norme';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx'; // Import XLSX to handle Excel files


@Component({
  selector: 'app-chapitre-list',
  templateUrl: './chapitre-list.component.html',
  styleUrl: './chapitre-list.component.css'
})
export class ChapitreListComponent implements OnInit{
  normeId: string = '';
  norme!: Norme;
  chapitres!: any[];
  newChapitreTitle: string = ''; // Titre du nouveau chapitre
  showAddForm: boolean = false; 
  display: boolean = false;
  selectedChapitre: any = null;
  
  uploadedFile: File | null = null;
  chaptersAndPoints: any[] = []; // To store chapters and control points
  loading: boolean = false;

constructor(
  private chapitreService:ChapitreService, 
  private route: ActivatedRoute,
  private confirmationService: ConfirmationService,
  private messageService:MessageService
){}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.normeId = params.get('normeId') || '';
      if (this.normeId) {
        this.loadChapitres();
      } else {
        // Gérer le cas où normeId est null
        console.error('normeId is null');
      }
    });
  }

  saveChapitre(newData:any): void {
    this.chapitres.unshift(newData);
  }

  cancelAdd(isClosed: boolean): void {
    this.showAddForm = !isClosed;
  }

  
  // Handle the file selection and processing
  onSelectFile(event: any) {
    const file = event.files[0]; // Access the first selected file
    if (file) {
      this.loading = true; // Show loading modal
      this.uploadedFile = file;
      this.readExcelFile(file);
    }
  }

  readExcelFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      const excelData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers: string[] = excelData[0] as string[];
  
      const chapitreIndex = headers.indexOf('Chapitre');
      const objectifIndex = headers.indexOf('Objectif');
      const regleIndex = headers.indexOf('Règle');
  
      const chaptersMap: { [key: string]: any } = {};
  
      let lastChapter = "";
      let lastObj = "";
  
      for (let i = 3; i < excelData.length; i++) {
        const row: any[] = excelData[i];
        const chapitre = row[0] || lastChapter;
        //const objectif = row[1] || lastObj;
        const regle = row[1];
  
        if (!regle) continue;
  
        if (chapitre && chapitre !== lastChapter) {
          lastChapter = chapitre;
        }
  
        if (chaptersMap[chapitre]) {
          /*if (objectif && objectif !== lastObj) {
            lastObj = objectif;
          }*/
          chaptersMap[chapitre].pointsControle.push({
            designation: regle,
           // objectif: objectif,
          });
        } else {
         /* if (objectif && objectif !== lastObj) {
            lastObj = objectif;
          }*/
          chaptersMap[chapitre] = {
            chapitre: chapitre,
            pointsControle: [
              {
                designation: regle,
                //objectif: objectif,
              },
            ],
          };
        }
      }
  
      const chaptersAndPoints = Object.values(chaptersMap);
      this.uploadChaptersAndControlPoints(chaptersAndPoints);
    };
    reader.readAsArrayBuffer(file);
  }
  
  // Send chapters and control points to the backend
  uploadChaptersAndControlPoints(data: any) {
    this.chapitreService.uploadNormDetails(this.normeId, data).subscribe(
      (response) => {
        console.log('Chapters and control points uploaded successfully', response);
        this.loadChapitres(); // Reload chapters after upload
        this.loading = false; // Hide the loading spinner after success
      },
      (error) => {
        console.error('Error uploading chapters and control points', error);
        this.loading = false; // Hide the loading spinner on error
      }
    );
  }

  loadChapitres(): void {
    this.chapitreService.findAllByNorme(this.normeId).subscribe((data: any[]) => {
      this.chapitres = data;
    });
  }
  handleDeleteChapitre(chapitre:Chapitre){
    this.confirmationService.confirm({
      message: 'Voulez vous supprimer ce chapitre ?',
      header: 'Confirmer la suppression',
      icon: 'pi pi-info-circle',
      rejectButtonStyleClass:"p-button-danger p-button-text",
      acceptButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.chapitreService.deleteChapitre(chapitre.id).subscribe(
          response => {
            this.chapitres = this.chapitres.filter(data => data.id !== chapitre.id);
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Chapitre supprimé' });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Vous avez refusé' });
          }
        )
      }
    })
  }
  handleEditChapitre(chapitre:Chapitre){
    this.display=true;
    this.selectedChapitre=chapitre;
  }

  updateChapitre(newData: any){
    if(newData.id === this.selectedChapitre.id){
      const chapitre = this.chapitres.findIndex(data => data.id === newData.id)
      this.chapitres[chapitre]=newData;
    }else{
      this.chapitres.unshift(newData);
    }
    this.ngOnInit();
  }
  cancelUpdate(isClosed: boolean){
    this.display = !isClosed;
  }
}
