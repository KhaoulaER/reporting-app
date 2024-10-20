import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Norme } from '../entities/norme.entity';
import { Chapitre } from '../chapitres/entities/chapitre.entity';
import { PointsControle } from '../chapitres/points-controle/entities/points-controle.entity';

@Injectable()
export class ExcelImportService {
    constructor(
        @InjectRepository(Norme) private normeRepository: Repository<Norme>,
        @InjectRepository(Chapitre) private chapitreRepository: Repository<Chapitre>,
        @InjectRepository(PointsControle) private pcRepository: Repository<PointsControle>
    ) {}

    async importDataFromExcel(filePath: string) {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        for (const row of rows) {
            const norme = await this.normeRepository.save({
                designation: 'Your Norme Name',
                echel: '',
            });

            const chapitre = await this.chapitreRepository.save({
                titre: row['Chapitre'],
                description: '',
                norme: norme,
            });

            const pointsControle = await this.pcRepository.save({
                designation: row['Règle'],
                objectif: row['Objectif'],
                chapitre: chapitre,
            });

            console.log('Inserted:', chapitre, pointsControle);
        }
    }
}
