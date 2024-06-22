import { Module } from '@nestjs/common';
import { NormesService } from './_business/normes.service'; 
import { NormesController } from './normes.controller';
import { Norme } from './entities/norme.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapitresModule } from './chapitres/chapitres.module';
import { Chapitre } from './chapitres/entities/chapitre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Norme,Chapitre]), ChapitresModule],
  controllers: [NormesController],
  providers: [NormesService],
})
export class NormesModule {}
