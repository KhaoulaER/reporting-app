import { forwardRef, Module } from '@nestjs/common';
import { PointsControleService } from './_business/points-controle.service';
import { PointsControleController } from './points-controle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsControle } from './entities/points-controle.entity';
import { Chapitre } from '../entities/chapitre.entity';
import { PreuvesModule } from './preuves/preuves.module';
import { KeycloakServiceModule } from 'src/keycloak.module';

@Module({
  imports: [TypeOrmModule.forFeature([PointsControle,Chapitre]), PreuvesModule, 
  //forwardRef(() => KeycloakServiceModule)
  ],
  controllers: [PointsControleController],
  providers: [PointsControleService],
})
export class PointsControleModule {}
