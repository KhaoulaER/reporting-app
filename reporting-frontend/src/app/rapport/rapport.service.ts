import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { NormeAdopte } from '../projets/model/projet';


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

      // Ajout du titre
      const titleCellAudit = worksheetAudit.getCell('A1');
      titleCellAudit.value = 'Evaluation et mise en oeuvre des règles de la norme x';
      titleCellAudit.font = {
        size: 14,
        bold: true,
        underline: true,
        italic: true
      };
      worksheetAudit.mergeCells('D1:L1'); // Fusion correcte pour le titre

      // Ajout du logo et du nom du projet
      if (normeAdopte.projet?.client?.logo) {
        const base64Image = await getBase64ImageFromURL('http://localhost:3000/' + normeAdopte.projet.client.logo);
        const imageId = workbook.addImage({
          base64: base64Image,
          extension: 'png',
        });
        worksheetAudit.addImage(imageId, {
          tl: { col: 0, row: 2 }, // Top left corner of the image
          ext: { width: 160, height: 50 }
        });
      }
      worksheetAudit.getCell('F3').value = normeAdopte.projet?.designation || 'Nom du projet';
      worksheetAudit.getCell('F3').font = {
        size: 14,
        bold: true
      };
      worksheetAudit.mergeCells('A3:E3'); // Fusion correcte pour le nom du projet

      // Ajout des en-têtes de colonnes à partir de la ligne 5
      const headersAudit = [
        { header: 'Chapitre', key: 'chapitre', width: 40 },
        { header: 'Règles', key: 'regles', width: 30 },
        { header: 'Niveau de Maturité', key: 'niveau_maturite', width: 20 },
        { header: 'Constat Near Secure', key: 'constat', width: 30 },
        { header: 'Documents vérifiés', key: 'commentaire', width: 30 }
      ];

      worksheetAudit.columns = headersAudit;
      const headerRowAudit = worksheetAudit.getRow(5);
      headerRowAudit.values = headersAudit.map(header => header.header);
      headerRowAudit.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF0000' }
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
          bold: true
        };
      });

      let currentRowAudit = 6;
      let currentChapterAudit = dataAudit[0]?.chapitre;
      let mergeStartRowAudit = 6;
      dataAudit.forEach((item, index) => {
        worksheetAudit.addRow(item);
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

      // Feuille de conformité
      const worksheetConformite = workbook.addWorksheet('Conformité');

      // Ajout du titre
      const titleCellConformite = worksheetConformite.getCell('A1');
      titleCellConformite.value = 'Synthèse de la conformité';
      titleCellConformite.font = {
        size: 16,
        bold: true,
        underline: true,
        italic: true
      };
      worksheetConformite.mergeCells('A1:E1'); // Fusion correcte pour le titre

      // Ajout du logo et du nom du projet
      if (normeAdopte.projet?.client?.logo) {
        const base64Image = await getBase64ImageFromURL('http://localhost:3000/' + normeAdopte.projet.client.logo);
        const imageId = workbook.addImage({
          base64: base64Image,
          extension: 'png'
        });
        worksheetConformite.addImage(imageId, {
          tl: { col: 0, row: 2 }, // Top left corner of the image
          ext: { width: 160, height: 50 }
        });
      }
      worksheetConformite.getCell('A3').value = normeAdopte.projet?.designation || 'Nom du projet';
      worksheetConformite.getCell('A3').font = {
        size: 14,
        bold: true
      };
      worksheetConformite.mergeCells('A3:E3'); // Fusion correcte pour le nom du projet

      // Ajout des en-têtes de colonnes à partir de la ligne 5
      const headersConformite = [
        { header: 'Chapitre', key: 'chapitre', width: 40 },
        { header: 'Nombre de question', key: 'nombre_pc_audit', width: 10 },
        ...niveauMaturite.map(niveau => ({ header: niveau, key: niveau.toLowerCase(), width: 10 })),
        { header: 'Niveau de maturité', key: 'conformite', width: 10 }
      ];

      worksheetConformite.columns = headersConformite;
      const headerRowConformite = worksheetConformite.getRow(5);
      headerRowConformite.values = headersConformite.map(header => header.header);
      headerRowConformite.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF0000' }
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
          bold: true
        };
      });

      dataConformite.forEach(item => {
        const row = worksheetConformite.addRow({
          chapitre: item.chapitre,
          nombre_pc_audit: item.nombre_pc_audit,
          conformite: item.conformite * 100 + '%'
        });

        item.result.forEach((result: any) => {
          row.getCell(result.niveau_maturite.toLowerCase()).value = result.nb_pc_audit;
        });
      });

      // Save the workbook
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `${fileName}_${new Date().getTime()}.xlsx`);
      });
    }

    generateSheet();
  }
}
