import { Module } from '@nestjs/common';
import { NormeAdopteService } from './_business/norme-adopte.service'; 
import { NormeAdopteController } from './norme-adopte.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Norme } from 'src/normes/entities/norme.entity';
import { Projet } from '../entities/projet.entity';
import { NormeAdopte } from './entities/norme-adopte.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NormeAdopte,Norme,Projet])],
  controllers: [NormeAdopteController],
  providers: [NormeAdopteService],
})
export class NormeAdopteModule {}
