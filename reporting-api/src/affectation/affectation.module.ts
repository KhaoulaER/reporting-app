import { forwardRef, Module } from '@nestjs/common';
import { AffectationService } from './_business/affectation.service'; 
import { AffectationController } from './affectation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Affectation } from './entities/affectation.entity';
import { User } from 'src/users/entities/user.entity';
import { Projet } from 'src/projets/entities/projet.entity';
import { KeycloakServiceModule } from 'src/keycloak.module';
import { AuditModule } from 'src/audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Affectation,User,Projet]),
  forwardRef(() => KeycloakServiceModule),
  AuditModule
],
  controllers: [AffectationController],
  providers: [AffectationService],
})
export class AffectationModule {}
