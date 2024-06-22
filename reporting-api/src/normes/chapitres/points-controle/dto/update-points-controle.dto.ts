import { PartialType } from '@nestjs/mapped-types';
import { CreatePointsControleDto } from './create-points-controle.dto';

export class UpdatePointsControleDto extends PartialType(CreatePointsControleDto) {
    readonly designation: string 
    readonly objectif: string
}
