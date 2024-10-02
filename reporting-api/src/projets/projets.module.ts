import { forwardRef, Module } from '@nestjs/common';
import { ProjetsService } from './_business/projets.service'; 
import { ProjetsController } from './projets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projet } from './entities/projet.entity';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/users/entities/user.entity';
import { NormeAdopteModule } from './norme-adopte/norme-adopte.module';
import { Norme } from 'src/normes/entities/norme.entity';
import { NormeAdopte } from './norme-adopte/entities/norme-adopte.entity';
import { KeycloakServiceModule } from 'src/keycloak.module';
import { AuditModule } from 'src/audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Projet,Client,User,Norme,NormeAdopte]), NormeAdopteModule, 
  forwardRef(() => KeycloakServiceModule),
  AuditModule
  ],
  controllers: [ProjetsController],
  providers: [ProjetsService],
})
export class ProjetsModule {}
