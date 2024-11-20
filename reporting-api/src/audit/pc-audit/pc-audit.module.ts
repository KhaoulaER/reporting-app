import { forwardRef, Module } from '@nestjs/common';
import { PcAuditService } from './_business/pc-audit.service'; 
import { PcAuditController } from './pc-audit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcAudit } from './entities/pc-audit.entity';
import { Audit } from '../entities/audit.entity';
import { NormeAdopte } from 'src/projets/norme-adopte/entities/norme-adopte.entity';
import { PreuveVerifieModule } from './preuve_verifie/preuve_verifie.module';
import { Preuve } from 'src/normes/chapitres/points-controle/preuves/entities/preuve.entity';
import { AuditModule } from '../audit.module';
import { NormeAdopteModule } from 'src/projets/norme-adopte/norme-adopte.module';
import { PcAuditHistory } from './entities/pc-audit-history';

@Module({
  imports: [TypeOrmModule.forFeature([PcAudit,Audit,Preuve, PcAuditHistory]), PcAuditModule, PreuveVerifieModule, NormeAdopteModule,
  forwardRef(() => AuditModule)],
  controllers: [PcAuditController],
  exports: [PcAuditService],
  providers: [PcAuditService],
})
export class PcAuditModule {}
