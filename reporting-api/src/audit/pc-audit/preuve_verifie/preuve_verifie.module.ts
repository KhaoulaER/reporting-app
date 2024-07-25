import { Module } from '@nestjs/common';
import { PreuveVerifieService } from './_business/preuve_verifie.service'; 
import { PreuveVerifieController } from './preuve_verifie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreuveVerifie } from './entities/preuve_verifie.entity';
import { Preuve } from 'src/normes/chapitres/points-controle/preuves/entities/preuve.entity';
import { PcAudit } from '../entities/pc-audit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PreuveVerifie,Preuve,PcAudit]), PreuveVerifieModule],
  controllers: [PreuveVerifieController],
  providers: [PreuveVerifieService],
  exports: [PreuveVerifieService]
})
export class PreuveVerifieModule {}
