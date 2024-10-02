import { Module } from '@nestjs/common';
import { AuditService } from './_business/audit.service';
import { AuditController } from './audit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormeAdopte } from 'src/projets/norme-adopte/entities/norme-adopte.entity';
import { Audit } from './entities/audit.entity';
import { User } from 'src/users/entities/user.entity';
import { PcAuditModule } from './pc-audit/pc-audit.module';
import { PcAudit } from './pc-audit/entities/pc-audit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Audit,NormeAdopte,User,PcAudit]), AuditModule, PcAuditModule],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService]
})
export class AuditModule {}
