import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
//import XlsxPopulate from 'xlsx-populate';

import { NormeAdopte } from '../projets/model/projet';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';


@Injectable({
  providedIn: 'root'
})
export class RapportService {

  constructor() { }

  generateExcel(dataAudit: any[], dataConformite: any[], niveauMaturite: string[], fileName: string, normeAdopte: NormeAdopte): void {
    const workbook = new ExcelJS.Workbook();

    function getBase64ImageFromURL(url: string): Promise<string> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        };
        img.onerror = error => reject(error);
        img.src = url;
      });
    }

    async function generateSheet() {
      // Feuille d'audit
      const worksheetAudit = workbook.addWorksheet('Audit');

      // Ajout du logo et du nom du projet
      if (normeAdopte.projet?.client?.logo) {
        const base64Image = await getBase64ImageFromURL('http://localhost:3000/' + normeAdopte.projet.client.logo);
        const imageId = workbook.addImage({
          base64: base64Image,
          extension: 'png',
        });
        worksheetAudit.addImage(imageId, {
          tl: { col: 0, row: 0 }, // Top left corner of the image
          ext: { width: 160, height: 50 }
        });
      }
      worksheetAudit.getCell('C2').value = 'Evaluation et mise en oeuvre des règles de la norme: ' + normeAdopte.norme.designation;
      worksheetAudit.getCell('C2').font = {
        size: 14,
        bold: true
      };
      const base64Imagee = await getBase64ImageFromURL('../../../assets/images/logoo.png');
         const imageIdd = workbook.addImage({
           base64: base64Imagee,
           extension: 'png'
         });
         worksheetAudit.addImage(imageIdd, {
           tl: { col: 6, row: 0 }, // Top left corner of the image
           ext: { width: 160, height: 50 }
         });


      // Define the worksheet columns to include 'Conformité'
if (normeAdopte?.norme?.echel !== '0->3') {
worksheetAudit.columns = [
  { key: 'chapitre', width: 15 },
  { key: 'regles', width: 20 },
  { key: 'niveau_maturite', width: 20 },
  { key: 'conformite', width: 20 },  // New column for Conformité
  { key: 'constat', width: 30 },
  { key: 'preuve', width: 30 },
  { key: 'recommandation', width: 30 }
];
}
else{
  worksheetAudit.columns = [
    { key: 'chapitre', width: 15 },
    { key: 'regles', width: 20 },
    { key: 'niveau_maturite', width: 20 },
    { key: 'constat', width: 30 },
    { key: 'preuve', width: 30 },
    { key: 'recommandation', width: 30 }
  ];
}

// Add column headers, including 'Conformité'
const headerRowAudit = worksheetAudit.getRow(6);
if (normeAdopte?.norme?.echel !== '0->3') {
headerRowAudit.values = [
  'Chapitre',
  'Règles',
  'Niveau de Maturité',
  'Conformité',  // New header for Conformité
  'Constat Near Secure',
  'Documents vérifiés',
  'Recommandations'
];
}
else{
  headerRowAudit.values = [
    'Chapitre',
    'Règles',
    'Niveau de Maturité',
    'Constat Near Secure',
    'Documents vérifiés',
    'Recommandations'
  ];
}
      headerRowAudit.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4682B4' }
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
          bold: true,
          size: 11
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      });
      // Enlever les bordures des 4 premières lignes entre les colonnes A et G
      for (let rowNum = 1; rowNum <= 4; rowNum++) {
        const row = worksheetAudit.getRow(rowNum);
        for (let colNum = 1; colNum <= 7; colNum++) { // Colonne de A à G
          const cell = row.getCell(colNum);
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFFFFFFF' } }, // Bordure très fine et couleur blanche
            left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
            bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
            right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
          };
        }
      }

      let currentRowAudit = 7;
      let currentChapterAudit = dataAudit[0]?.chapitre;
      let mergeStartRowAudit = 7;
      dataAudit.forEach((item, index) => {
        // Determine Conformité based on Niveau de Maturité
        let conformite = '';
        if (normeAdopte?.norme?.echel !== '0->3') {
          switch (item.niveau_maturite) {
            case 'Aucun':
            case 'Initial':
              conformite = 'Non Conforme';
              break;
            case 'Reproductible':
            case 'Défini':
              conformite = 'Partielle';
              break;
            case 'Maîtrisé':
            case 'Optimisé':
              conformite = 'Conforme';
              break;
            default:
              conformite = '';  // Leave blank if niveau_maturite is undefined or doesn't match
          }
        }
      
        // Add the row, including the Conformité value
        const row = worksheetAudit.addRow({
          chapitre: item.chapitre,
          regles: item.regles,
          niveau_maturite: item.niveau_maturite,
          conformite: conformite,  // New Conformité value
          constat: item.constat,
          preuve: item.preuve || '',
          recommandation: item.recommandation
        });
      
        // Add your cell styling and alignment here as before
        row.eachCell((cell, colNumber) => {
          cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
          };
          cell.font = { size: 10 };
          
            // Conditional formatting for 'Niveau de Maturité' (third column)
        if (colNumber === 3) {
          switch (cell.value) {
            case 'Non_conforme':
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'F08080' } // Red
              };
              break;
            case 'Partielle':
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'F0E68C' } // Yellow
              };
              break;
            case 'Totale':
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCCFFCC' } // Green
              };
              break;
            default:
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFFFF' } // Default white background
              };
          }

          
      }
    if(colNumber === 1){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '99CCFF' } // Default white background
        };
      }
    
          
      
          // Apply conditional formatting for Conformité (fifth column in this case)
          if (colNumber === 4) {  // Adjust to match the new Conformité column index
            switch (cell.value) {
              case 'Non Conforme':
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F08080' } }; // Red for Non Conforme
                break;
              case 'Partielle':
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F0E68C' } }; // Yellow for Partielle
                break;
              case 'Conforme':
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCFFCC' } }; // Green for Conforme
                break;
              default:
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // Default white
            }
          }
        });
        
      
        if (index > 0 && item.chapitre !== currentChapterAudit) {
          if (currentRowAudit - mergeStartRowAudit > 1) {
            worksheetAudit.mergeCells(`A${mergeStartRowAudit}:A${currentRowAudit - 1}`);
          }
          mergeStartRowAudit = currentRowAudit;
          currentChapterAudit = item.chapitre;
        }
        currentRowAudit++;
      });
      if (currentRowAudit - mergeStartRowAudit > 1) {
        worksheetAudit.mergeCells(`A${mergeStartRowAudit}:A${currentRowAudit - 1}`);
      }

      

       // Feuille de conformité *****************************************************************
       const worksheetConformite = workbook.addWorksheet('Conformité');
       const totalControlPoints = dataAudit.length;
       console.log('Total number of control points (Règles):', totalControlPoints);
       // **Count the number of control points with non-empty 'niveau_maturite'**
      const nonEmptyNiveauCount = dataAudit.filter(item => item.niveau_maturite).length;

      const emptyNiveauCount = totalControlPoints - nonEmptyNiveauCount
      const validNiveauMaturite = niveauMaturite.filter(niveau => niveau !== 'N/A');


       // Ajout du logo et du nom du projet*****************
       if (normeAdopte.projet?.client?.logo) {
         const base64Image = await getBase64ImageFromURL('http://localhost:3000/' + normeAdopte.projet.client.logo);
         const imageId = workbook.addImage({
           base64: base64Image,
           extension: 'png'
         });
         worksheetConformite.addImage(imageId, {
           tl: { col: 0, row: 0 }, // Top left corner of the image
           ext: { width: 160, height: 50 }
         });
       }
       // Ajouter le texte du projet et la norme
      worksheetConformite.getCell('B2').value = 'Audit de conformité de la sécurité des systèmes d\'information de ' + normeAdopte.projet?.client.nom;
      worksheetConformite.getCell('B3').value = 'par rapport aux exigences de la norme ' + normeAdopte.norme.designation;
      worksheetConformite.getCell('B2').font = {
        size: 14,
        bold: true
      };
      worksheetConformite.getCell('B3').font = {
        size: 14,
        bold: true
      };

      const base64Image = await getBase64ImageFromURL('../../../assets/images/logoo.png');
         const imageId = workbook.addImage({
           base64: base64Image,
           extension: 'png'
         });
         worksheetConformite.addImage(imageId, {
           tl: { col: 7, row: 0 }, // Top left corner of the image
           ext: { width: 160, height: 50 }
         });


// Définir les colonnes sans ajouter automatiquement les en-têtes***************************
worksheetConformite.columns = [
  { key: 'chapitre', width: 50 },
  { key: 'nombre_pc_audit', width: 14 },
  //...niveauMaturite.map(niveau => ({ key: niveau.toLowerCase(), width: 10 })), 
  ...validNiveauMaturite.map(niveau => ({ key: niveau.toLowerCase(), width: 14 })), 
  { key: 'conformite', width: 10 },
  {key: 'niveau_cible', width: 10}
];

console.log('niveau maturite:', niveauMaturite)

// Ajout des en-têtes de colonnes à partir de la ligne 6
const headerRowConformite = worksheetConformite.getRow(6);
headerRowConformite.values = [
  'Conformité par rapport à la ' + normeAdopte?.norme?.designation,
  'Nombre de question',
  //...niveauMaturite,
  ...validNiveauMaturite,  // Use only valid 'niveau_maturite'

  'Conformité',
  'Niveau cible'
];
      headerRowConformite.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4682B4' }
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
          bold: true,
          size: 11
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      });


       dataConformite.forEach(item => {
         const row = worksheetConformite.addRow({
           chapitre: item.chapitre,
           nombre_pc_audit: item.nombre_pc_audit,
           conformite: item.conformite * 100 + '%',
           niveau_cible: '80 %'
         });
 
         item.result.forEach((result: any) => {
          if (validNiveauMaturite.includes(result.niveau_maturite)) {
           row.getCell(result.niveau_maturite.toLowerCase()).value = result.nb_pc_audit;
          }
         });
         row.eachCell((cell,colNumber) => {
          cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
          };
          cell.font = {
            size: 10
          };

          
           // Apply red background to the last column (Conformité)
    if (colNumber === worksheetConformite.columns.length - 1) { // Last column
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4682B4' } // Red color for the Conformité column
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' }, // White text
        size: 10
      };
    }
    if (colNumber === worksheetConformite.columns.length) { // Last column
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E6E6FA' } // Red color for the Conformité column
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' }, // White text
        size: 10
      };
    }
  });
       });
 
       
       // Calculate the average of 'conformite' percentages
const totalConformiteSum = dataConformite.reduce((sum, item) => sum + (item.conformite || 0), 0);
const averageConformite = (totalConformiteSum / dataConformite.length) * 100; // in percentage

// Add the row for 'Conformité moyenne'
const averageConformiteRow = worksheetConformite.addRow({
  chapitre: 'Conformité moyenne',
  nombre_pc_audit: '', // Not applicable for this row
  conformite: averageConformite.toFixed(2) + '%', // Show the average value
  niveau_cible: '' // Empty, as it's not relevant here
});

// Style the 'Conformité moyenne' row (make it bold and centered)
averageConformiteRow.eachCell((cell, colNumber) => {
  cell.font = { bold: true }; // Bold text
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
  cell.border = {
    top: { style: 'thin', color: { argb: '000000' } },
    left: { style: 'thin', color: { argb: '000000' } },
    bottom: { style: 'thin', color: { argb: '000000' } },
    right: { style: 'thin', color: { argb: '000000' } }
  };
  // Apply color for the Conformité column
  if (colNumber === worksheetConformite.columns.length - 2) { // Adjust the column index if necessary
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4682B4' } // Blue background
    };
    cell.font = {
      color: { argb: 'FFFFFFFF' }, // White text for contrast
      size: 10
    };
  }
});
       const totalRow = worksheetConformite.addRow({
        chapitre: 'Total des points de contrôle',
        nombre_pc_audit: totalControlPoints,
        conformite: ''  // Empty as it's not relevant for total row
      });
    
      totalRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true }; // Make the total row bold
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4682B4' } // Red color for the Conformité column
        };
      });
    
      // Apply specific formatting for the 'Nombre de points de contrôle' column
      const totalCell = totalRow.getCell('B');
      totalCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCFFCC' } // Light green background for total
      };
      totalCell.font = {
        bold: true,
        color: { argb: '000000' }
      };

      // **Add row for total control points with valid 'niveau_maturite'**
      const totalValidNiveauRow = worksheetConformite.addRow({
        chapitre: 'Total des mesures applicables',
        nombre_pc_audit: nonEmptyNiveauCount,
        conformite: ''  // No conformity for total row
      });

      // Style this row (bold and centered)
      totalValidNiveauRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
        cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4682B4' } // Red color for the Conformité column
      };
      });

      
      // **Add row for total control points with valid 'niveau_maturite'**
      const totalNonValidNiveauRow = worksheetConformite.addRow({
        chapitre: 'Total des mesures non applicables',
        nombre_pc_audit: emptyNiveauCount,
        conformite: ''  // No conformity for total row
      });

      // Style this row (bold and centered)
      totalNonValidNiveauRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4682B4' } // Red color for the Conformité column
        };
      });
    

      
    
       // Enlever les bordures des 4 premières lignes entre les colonnes A et G
       for (let rowNum = 1; rowNum <= 4; rowNum++) {
         const row = worksheetConformite.getRow(rowNum);
         for (let colNum = 1; colNum <= 10; colNum++) { // Colonne de A à G
           const cell = row.getCell(colNum);
           cell.border = {
            top: { style: 'thin', color: { argb: 'FFFFFFFF' } }, // Bordure très fine et couleur blanche
            left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
            bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
            right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
           };
         }
       }


// Create radar chart
const chartConfiguration: ChartConfiguration<'radar', number[], ChartOptions<'radar'>> = {
  type: 'radar',
  data: {
    labels: dataConformite.map(item => item.chapitre),
    datasets: [{
      label: 'Conformité',
      data: dataConformite.map(item => item.conformite * 100),
      backgroundColor: 'rgba(0, 99, 132, 0.2)',
      borderColor: 'rgba(0, 99, 132, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true
  }
};

// Convert the chart to an image
const radarChartImage = await new Promise<string>((resolve, reject) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    reject('Failed to create canvas context');
    return;
  }

  const chartInstance = new Chart(ctx, chartConfiguration);
  chartInstance.update();

  // Use setTimeout to allow the chart to render completely
  setTimeout(() => {
    const dataURL = canvas.toDataURL('image/png');
    resolve(dataURL);
  }, 0);
});

// Add the radar chart image to the sheet
const imageChart = workbook.addImage({
  base64: radarChartImage,
  extension: 'png',
});
worksheetConformite.addImage(imageChart, {
  tl: { col: 0, row: 10 },
  ext: { width: 600, height: 400 }
});


 /* const base64RadarChart = await generateRadarChartAsBase64(dataConformite);
  const radarChartImageId = workbook.addImage({
    base64: base64RadarChart,
    extension: 'png'
  });

  worksheetConformite.addImage(radarChartImageId, {
    tl: { col: 0, row: 10 },
    ext: { width: 400, height: 300 }
  });*/
       // Add radar chart image
  /*const radarChartBase64 = generateRadarChartAsBase64(dataConformite).then((radarChartBase64: string) => {
    const radarChartImageId = workbook.addImage({
      base64: radarChartBase64,
      extension: 'png'
    });
  
    worksheetConformite.addImage(radarChartImageId, {
      tl: { col: 0, row: 10 },
      ext: { width: 400, height: 300 }
    });
  }).catch(error => {
    console.error('Error generating radar chart:', error);
  });
  const radarChartImageId = workbook.addImage({
    base64: radarChartBase64,
    extension: 'png'
  });

  worksheetConformite.addImage(radarChartImageId, {
    tl: { col: 0, row: 10 },
    ext: { width: 400, height: 300 }
  });*/

  // Save Excel file
  /*const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName);*/

  
// Feuille d'aide *****************************************************************
// Feuille d'aide
// Create the worksheet
const worksheetAide = workbook.addWorksheet('Aide');

// Apply a white background to the entire worksheet (excluding tables)
worksheetAide.eachRow((row, rowNumber) => {
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    // Set a white background for all cells
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' } // White background
    };

    // Remove borders from all cells by default
     // Set all borders to null (removes borders)
    
  });
});

// Set column A width to approximately 37px (roughly 5 character units)
worksheetAide.getColumn('A').width = 5;

// Add the title (merged across columns B to E)
worksheetAide.mergeCells('B2:D2');
const titleCell = worksheetAide.getCell('B2');
titleCell.value = 'Evaluation et mise en oeuvre des règles de la norme: ' + normeAdopte.norme.designation;
titleCell.font = {
  size: 16,
  bold: true,
  color: { argb: '990000' }
};
titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

// Apply border to the title cell only
titleCell.border = {
  top: { style: 'thin', color: { argb: '000000' } },
  left: { style: 'thin', color: { argb: '000000' } },
  bottom: { style: 'thin', color: { argb: '000000' } },
  right: { style: 'thin', color: { argb: '000000' } }
};

// Add the paragraph (merged across columns B to E)
worksheetAide.mergeCells('B4:D6');
const paragraphCell = worksheetAide.getCell('B4');
paragraphCell.value = `L'objectif de cette feuille est d'évaluer le niveau de maturité atteint pour chacune des mesures de sécurité édictées par la ${normeAdopte.norme.designation} et ainsi en déduire le niveau de conformité. L'auteur de l'évaluation est invité à évaluer la mise en oeuvre de chacune des règles selon l'échelle suivante : `;
paragraphCell.font = { size: 12 };
paragraphCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

// Set column widths (starting from column B)
worksheetAide.columns = [
  { key: 'A', width: 5 },   // Narrow column A for spacing
  { key: 'B', width: 20 },  // Column for Maturity Level
  { key: 'C', width: 50 },  // Column for Description
  { key: 'D', width: 50 },  // Other columns as needed
];

// Add table headers for Maturity Levels and Description in row 8 starting from column B
const headerRowAide = worksheetAide.addRow(['', 'Niveau de Maturité', 'Description']);
headerRowAide.font = { bold: true, size: 12 };
headerRowAide.alignment = { vertical: 'middle', horizontal: 'center' };

headerRowAide.eachCell({ includeEmpty: true }, (cell, colNumber) => {
  if (colNumber > 1) {  // Apply styles only to columns B and beyond
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '990000' }
    };
    cell.font = {
      color: { argb: 'FFFFFFFF' },
      bold: true,
    };
    cell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };
  }
});

// Add rows for maturity levels and their descriptions starting from column B (row 9)
const maturiteDescriptions = [
  { niveau: 'N/A', description: 'La règle est non applicable dans le contexte de l\'entité ou de l\'IIV. (à justifier)' },
  { niveau: 'Aucun', description: 'Aucun processus/documentation en place.' },
  { niveau: 'Initial', description: 'Le processus est caractérisé par la prédominance d\'interventions ponctuelles, voir chaotiques.' },
  { niveau: 'Reproductible', description: 'Une gestion élémentaire de la sécurité est définie pour assurer le suivi des coûts, des délais et de la fonctionnalité.' },
  { niveau: 'Défini', description: 'Le processus de sécurité est documenté, normalisé et intégré dans les processus standards.' },
  { niveau: 'Maîtrisé', description: 'Des mesures détaillées sont prises en ce qui concerne le déroulement du processus.' },
  { niveau: 'Optimisé', description: 'Une amélioration continue du processus est mise en œuvre par une rétroaction quantitative.' }
];

maturiteDescriptions.forEach(item => {
  const row = worksheetAide.addRow(['', item.niveau, item.description]);
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber > 1) {
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
    }
  });
});

worksheetAide.mergeCells('B16:D17');
const textCell = worksheetAide.getCell('B16');
textCell.value = `Le niveau de conformité d'un contrôle est déduit du niveau de maturité de ce dernier selon l'échelle de correspondance suivante: `;
textCell.font = { size: 12 };
textCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

// Second table: Maturity level and Conformity level
const secondheaderRowAide = worksheetAide.addRow(['', 'Niveau de Maturité', 'Niveau de conformité']);
secondheaderRowAide.font = { bold: true, size: 12 };
secondheaderRowAide.alignment = { vertical: 'middle', horizontal: 'center' };

secondheaderRowAide.eachCell({ includeEmpty: true }, (cell, colNumber) => {
  if (colNumber > 1) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '990000' }
    };
    cell.font = {
      color: { argb: 'FFFFFFFF' },
      bold: true,
    };
    cell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };
  }
});

// Define the relationship between maturity and conformity levels
const conf_maturite = [
  { niveau: 'N/A', conformite: 'N/A' },
  { niveau: 'Aucun', conformite: 'Non_conforme' },
  { niveau: 'Initial', conformite: 'Non_conforme' },
  { niveau: 'Reproductible', conformite: 'Partielle' },
  { niveau: 'Défini', conformite: 'Partielle' },
  { niveau: 'Maîtrisé', conformite: 'Conforme' },
  { niveau: 'Optimisé', conformite: 'Conforme' }
];

// Add maturity levels and conformity levels, merging rows when conformity levels are the same
let lastConformity = '';
let mergeStartRow: number | null = null;

conf_maturite.forEach((item, index) => {
  const row = worksheetAide.addRow(['', item.niveau, item.conformite]);
  
  // Apply alignment and border styles to the cells in the row
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.alignment = { vertical: 'middle', horizontal: colNumber === 2 ? 'center' : 'left', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };
  });


  
  // If the conformity level is the same as the previous one, merge the conformity cell vertically
  if (item.conformite === lastConformity) {
    if (mergeStartRow === null) {
      mergeStartRow = row.number - 1;
    }
    worksheetAide.mergeCells(mergeStartRow, 3, row.number, 3); // Merge conformity cells
  } else {
    mergeStartRow = null; // Reset the merge start if the conformity changes
  }
  lastConformity = item.conformite;
});

  // Save the workbook
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}_${new Date().getTime()}.xlsx`);
  });
}



generateSheet();
}

generateRadarChartAsBase64(data: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject('Failed to create canvas context');
      return;
    }

    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Conformité',
          data: data.values,
          backgroundColor: 'rgba(0, 99, 132, 0.2)',
          borderColor: 'rgba(0, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          r: {
            angleLines: { display: false },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });

    chart.update();
    const dataURL = canvas.toDataURL();
    resolve(dataURL);
  });
}   
}


function generateRadarChartAsBase64(dataConformite: any[]) {
  throw new Error('Function not implemented.');
}

