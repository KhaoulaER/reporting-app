import { Module } from '@nestjs/common';
import { ClientsService } from './_business/clients.service'; 
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { AuditModule } from 'src/audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]),AuditModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
