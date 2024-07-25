import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver'

@Injectable({
  providedIn: 'root'
})
export class RapportXlsxService {

  constructor() { }
  async generateXlsx(data: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Ajoutez les en-têtes de colonnes
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Total Price', key: 'totalPrice', width: 15 },
      { header: 'Discount', key: 'discount', width: 10 },
    ];

    // Ajoutez les lignes de données
    data.forEach((item: any) => {
      worksheet.addRow(item);
    });

    // Générez le fichier Excel en tant que blob
    const buffer = await workbook.xlsx.writeBuffer();

    // Sauvegarder le fichier
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    FileSaver.saveAs(blob, 'output.xlsx');
  }
}
