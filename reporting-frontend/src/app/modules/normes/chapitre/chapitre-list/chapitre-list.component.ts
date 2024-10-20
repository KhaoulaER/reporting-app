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
      this.uploadedFile = file;
      this.readExcelFile(file);
    }
  }

  readExcelFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      // Access the third sheet (index 2)
      const sheetName = workbook.SheetNames[3];
      const worksheet = workbook.Sheets[sheetName];
  
      // Convert Excel data to JSON format as an array of arrays
      const excelData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Extract headers from the first row (cast to string[])
      const headers: string[] = excelData[0] as string[];
      
      // Define column indexes dynamically
      const chapitreIndex = headers.indexOf('Chapitre');
      const objectifIndex = headers.indexOf('Objectif');
      const regleIndex = headers.indexOf('Règle');
  
      // Initialize an object to group control points by chapter
      const chaptersMap: { [key: string]: any } = {};
  
      let lastChapter = ""; // Variable to keep track of the last valid chapter name
      let lastObj=""
      // Loop through the Excel rows starting from the second row (after the header)
      for (let i = 3; i < excelData.length; i++) {
        const row: any[] = excelData[i]; // Cast each row as an array
        console.log('Row:', row); // Log each row
  
        // Extract values using column indexes
        const chapitre = row[0] || lastChapter; // Use last chapter if current is empty
        const objectif = row[1] || lastObj; // Use empty string if no objectif
        const regle = row[2];
  
        // Skip rows that don't have a control point (rule/regle)
        if (!regle) continue;
  
        // Update last valid chapter name
        if (chapitre && chapitre !== lastChapter) {
          lastChapter = chapitre;
        }
  
        // If the chapter already exists in the map, push the new control point
        if (chaptersMap[chapitre]) {
          if(objectif && objectif !== lastObj){
            lastObj=objectif
          }
          chaptersMap[chapitre].pointsControle.push({
            designation: regle,
            objectif: objectif,
          });
        } else {
          // Otherwise, create a new chapter entry
          if(objectif && objectif !== lastObj){
            lastObj=objectif
          }
          chaptersMap[chapitre] = {
            
            chapitre: chapitre,
            pointsControle: [
              {
                designation: regle,
                objectif: objectif,
              },
            ],
          };
        }
      }
  
      // Convert the chaptersMap to an array to prepare it for upload
      const chaptersAndPoints = Object.values(chaptersMap);
      console.log('Chapters and Control Points:', chaptersAndPoints); // Log the structured data
  
      // Now send this structured data to the backend
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
      },
      (error) => {
        console.error('Error uploading chapters and control points', error);
      }
    );
  }

  // Read and process the Excel file
 /* readExcelFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      this.chaptersAndPoints = XLSX.utils.sheet_to_json(worksheet); // Convert to JSON array

      console.log('Chapters and Points:', this.chaptersAndPoints);
      // Here you can process the data and prepare it for the database
    };
    reader.readAsArrayBuffer(file);
  }
*/

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
