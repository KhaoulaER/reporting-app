import { Injectable } from '@angular/core';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import XmlTemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { NormeAdopte } from '../../projets/model/projet';
import * as fs from 'fs';
import * as path from 'path';
import ChartJsImage from 'chartjs-to-image';
import { Buffer } from 'buffer';
import ImageModule from 'docxtemplater-image-module-free'; // Import the image module
import { Chart } from 'chart.js';



@Injectable({
  providedIn: 'root'
})
export class RapportWordService {

  constructor(private http:HttpClient) { }
  generateWordReport(evaluations: any[], dataConformite: any, niveau: any, fileName: string, normeAdopte: any, auditeur:any,manager:any): void {
    (window as any).Buffer = Buffer;
    //CONFORMity col display?
    const showConformite = normeAdopte?.norme?.echel !== '0->3';

    // Fetch the Word template from assets
    this.http.get('/assets/templates/Rapport_Audit.docx', { responseType: 'arraybuffer' }).subscribe(
      async (content: ArrayBuffer) => {
        const zip = new PizZip(content);
        // Configure the image module
        const imageOpts = {
          centered: true,
          getImage: (chartImage: string) => {
            return Buffer.from(chartImage.split(',')[1], 'base64');
          },
          getSize: () => {
            // Ensure the returned value is a tuple [width, height]
            return [500, 250] as [number, number];
          },
        };
        
        const doc = new Docxtemplater(zip,{
          modules: [new ImageModule(imageOpts)]
        });

        // Extract unique chapters from evaluations

        // Extract unique chapters from evaluations
        const chapters = evaluations
          .map((evaluation) => ({
            title: evaluation.chapitre,
            regles: evaluation.regles // Assuming controlPoints exist in the evaluation
          }))
          .filter((value, index, self) => self.findIndex(chap => chap.title === value.title) === index); // Remove duplicates

        // Sort chapters alphabetically by title
        chapters.sort((a, b) => a.title.localeCompare(b.title));

        console.log('Chapters:', chapters);
        // Assign numbers based on sorted order
        const numberedChapters = chapters.map((chapter, index) => ({
          number: index + 1,
          title: chapter.title,
        }));

        // Assign numbers based on sorted order
       /* const titChapters = chapters.map((chapter, index) => ({
          number: `5.${index + 1}`, // Assuming starting chapter number as 5.x
          title: chapter.title,
        }));*/

        // Conformity table
        const conformityTable = dataConformite.map((data: { chapitre: any; nombre_pc_audit: any; conformite: number; }, index: any) => ({
          title: data.chapitre,
          nbreQuestions: data.nombre_pc_audit,
          maturiteNiveau: (data.conformite * 100).toFixed(2) + '%',
          maturiteCible: '80%',
        }));

        const totalControlPoints = evaluations.length;
        const totalConformiteSum = dataConformite.reduce((sum: any, item: { conformite: any; }) => sum + (item.conformite || 0), 0);
        const averageConformite = (totalConformiteSum / dataConformite.length) * 100;

        // Conformite chart configuration
        // Create the chart and convert it to base64
        // Conformite chart configuration
        const chartConfiguration: any = {
          type: 'radar',
          data: {
            labels: dataConformite.map((item: { chapitre: any; }) => item.chapitre),
            datasets: [
              {
                label: 'Conformité',
                data: dataConformite.map((item: { conformite: number; }) => item.conformite * 100),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
              },
              {
                label: 'Conformité cible',
                data: dataConformite.map(() => 80),
                backgroundColor: 'rgba(0, 128, 0, 0.2)',
                borderColor: 'rgba(0, 128, 0, 1)',
                pointBackgroundColor: 'rgba(0, 128, 0, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(0, 128, 0, 1)',
              },
            ]
          },
          options: {
            responsive: true
          }
        };

        // Generate the chart image as a base64 string
        const chartImage = new ChartJsImage();
        chartImage.setConfig(chartConfiguration);
        chartImage.setWidth(900);
        chartImage.setHeight(500);
        const radarChartImage = await chartImage.toDataUrl(); // Generates the base64 image// Base64 image


// Group control points by chapter
const groupedChapters = evaluations.reduce((acc, evaluation) => {
  const chapter = acc.find((c: { title: any; }) => c.title === evaluation.chapitre);
  const conformityStatus = this.getConformityStatus(evaluation.niveau_maturite); // Define conformity based on maturity
// Split recommendation into three parts
const recommendations = this.splitRecommendations(evaluation.recommandation);
//console.log('recomms: ',evaluation.recommandation)

if(normeAdopte?.norme?.echel != '0->3'){
  if (chapter) {
    chapter.controlPoints.push({
      detail: evaluation.regles,
      constats: this.formatWithLineBreaks(evaluation.constat),
      maturite: evaluation.niveau_maturite || 'N/A',
      conformite: this.getConformityStatus(evaluation.niveau_maturite),
      recommandations:[{
        courtTerme: this.formatWithLineBreaks(recommendations.courtTerme),
        moyenTerme: this.formatWithLineBreaks(recommendations.moyenTerme),
        longTerme: this.formatWithLineBreaks(recommendations.longTerme),
        }
      ]
    });
  } else {
    acc.push({
      title: evaluation.chapitre,
      controlPoints: [{
        detail: evaluation.regles,
        constats: this.formatWithLineBreaks(evaluation.constat),
        maturite: evaluation.niveau_maturite || 'N/A',
        conformite: this.getConformityStatus(evaluation.niveau_maturite),
        recommandations:[{
        courtTerme: this.formatWithLineBreaks(recommendations.courtTerme),
        moyenTerme: this.formatWithLineBreaks(recommendations.moyenTerme),
        longTerme: this.formatWithLineBreaks(recommendations.longTerme)
        }
      ]
      }]
    });
  }}
  else{
    if (chapter) {
      chapter.controlPoints.push({
        detail: evaluation.regles,
        constats: this.formatWithLineBreaks(evaluation.constat),
        maturite: evaluation.niveau_maturite || 'N/A',
        recommandations:[{
          courtTerme: this.formatWithLineBreaks(recommendations.courtTerme),
          moyenTerme: this.formatWithLineBreaks(recommendations.moyenTerme),
          longTerme: this.formatWithLineBreaks(recommendations.longTerme),
          }
        ]
      });
    } else {
      acc.push({
        title: evaluation.chapitre,
        controlPoints: [{
          detail: evaluation.regles,
          constats: this.formatWithLineBreaks(evaluation.constat),
          maturite: evaluation.niveau_maturite || 'N/A',
          recommandations:[{
          courtTerme: this.formatWithLineBreaks(recommendations.courtTerme),
          moyenTerme: this.formatWithLineBreaks(recommendations.moyenTerme),
          longTerme: this.formatWithLineBreaks(recommendations.longTerme),
          }
        ]
        }]
      });
    }
  }
  return acc;
}, []);




// Assign numbers based on sorted order
const titChapters = groupedChapters.map((chapter: { title: any; controlPoints: any; }, index: number) => ({
  number: `5.${index + 1}`,
  title: chapter.title,
  controlPoints: chapter.controlPoints
}));

// Generate control point tables for each chapter
const controlPointTables = titChapters.map((chapter: { number: any; title: any; controlPoints: any; }) => ({
  CHAPTERTITLE: `${chapter.number} ${chapter.title}`,
  controlPoints: chapter.controlPoints
}));

console.log('Grouped Control Point Tables:', controlPointTables);

    // Set dynamic data for the placeholders in the document
    doc.setData({
      CLIENT: normeAdopte?.projet?.client?.nom,
      NORME: normeAdopte?.norme?.designation,
      clientChef:normeAdopte?.projet?.client?.nomcp +' '+ normeAdopte?.projet?.client?.prenomcp,
      manager: manager.firstName +' '+ manager.lastName,
      managerEmail: manager.email,
      auditeur: auditeur?.firstName +' '+auditeur?.lastName ,
      auditeurEmail:auditeur?.email,
      TotalPc: totalControlPoints,
      avConformite: averageConformite.toFixed(2),
      conformite: conformityTable,
      chapitres: numberedChapters,
      chartImage: radarChartImage, // Add the chart image to the placeholders
      CONTROLPOINTTABLES: controlPointTables,
      showConformite:showConformite // Add this to the data
    });

    try {
      // Render the document with dynamic data
      doc.render();
    } catch (error) {
      console.error('Error rendering document:', error);
      return;
    }

    // Generate the document as a Blob and download it
    const buf = doc.getZip().generate({ type: 'blob' });
    saveAs(buf, `${fileName}.docx`);
  },
  (error) => {
    console.error('Error fetching template:', error);
  }
);
}

  getConformityStatus(niveauMaturite: string): string {
    switch (niveauMaturite) {
      case 'Aucun':
      case 'Initial':
        return 'Non conforme';  // Red
      case 'Défini':
      case 'Reproductible':
        return 'Partielle';  // Yellow
      case 'Optimisé':
      case 'Maîtrisé':
        return 'Conforme';  // Green
      default:
        return 'N/A';  // Default black
    }
  }

splitRecommendations(recommandations: string) {
  const sections = {
    courtTerme: '',
    moyenTerme: '',
    longTerme: ''
  };

  const courtTermeIndex = recommandations.indexOf('### Court terme');
  const moyenTermeIndex = recommandations.indexOf('### Moyen terme');
  const longTermeIndex = recommandations.indexOf('### Long terme');

  if (courtTermeIndex !== -1) {
    sections.courtTerme = this.formatRecommendations(recommandations.slice(courtTermeIndex + 15, moyenTermeIndex !== -1 ? moyenTermeIndex : recommandations.length).trim());
  }

  if (moyenTermeIndex !== -1) {
    sections.moyenTerme = this.formatRecommendations(recommandations.slice(moyenTermeIndex + 16, longTermeIndex !== -1 ? longTermeIndex : recommandations.length).trim());
  }

  if (longTermeIndex !== -1) {
    sections.longTerme = this.formatRecommendations(recommandations.slice(longTermeIndex + 14).trim());
  }

  return sections;
}

formatRecommendations(recommendations: string): string {
  // Split the recommendations into lines, filter out empty lines,
  // and format each line as a bullet point
  return recommendations.split('\n')
    .filter(line => line.trim()) // Remove empty lines
    .map(line => `\r\n ${line.trim()}`) // Prepend bullet
    .join('\r\n'); // Join with Windows-style line breaks
}
formatWithLineBreaks(text: string): string {
  return text.replace('-',`\n`) // Utilise la syntaxe Word pour un saut de ligne
}
}
