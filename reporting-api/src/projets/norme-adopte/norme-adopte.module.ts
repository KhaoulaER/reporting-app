import { forwardRef, Module } from '@nestjs/common';
import { NormeAdopteService } from './_business/norme-adopte.service'; 
import { NormeAdopteController } from './norme-adopte.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Norme } from 'src/normes/entities/norme.entity';
import { Projet } from '../entities/projet.entity';
import { NormeAdopte } from './entities/norme-adopte.entity';
import { KeycloakServiceModule } from 'src/keycloak.module';

@Module({
  imports: [TypeOrmModule.forFeature([NormeAdopte,Norme,Projet]), 
  //forwardRef(() => KeycloakServiceModule)
  ],
  controllers: [NormeAdopteController],
  providers: [NormeAdopteService],
  exports: [NormeAdopteService]
})
export class NormeAdopteModule {}
