import { PartialType } from '@nestjs/mapped-types';
import { CreateAffectationDto } from './create-affectation.dto';
import { Projet } from 'src/projets/entities/projet.entity';

export class UpdateAffectationDto extends PartialType(CreateAffectationDto) {
    readonly date:Date;
    readonly droit:string;
    //readonly auditeur:User;
    readonly projet:Projet;
}
