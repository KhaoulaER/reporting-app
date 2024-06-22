import { Module } from '@nestjs/common';
import { PreuvesService } from './_business/preuves.service'; 
import { PreuvesController } from './preuves.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsControle } from '../entities/points-controle.entity';
import { Preuve } from './entities/preuve.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PointsControle,Preuve])],
  controllers: [PreuvesController],
  providers: [PreuvesService],
})
export class PreuvesModule {}
