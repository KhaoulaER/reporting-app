import { Module } from '@nestjs/common';
import { ChapitresService } from './_business/chapitres.service';
import { ChapitresController } from './chapitres.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapitre } from './entities/chapitre.entity';
import { Norme } from '../entities/norme.entity';
import { PointsControleModule } from './points-controle/points-controle.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chapitre,Norme]), PointsControleModule],
  controllers: [ChapitresController],
  providers: [ChapitresService],
})
export class ChapitresModule {}
