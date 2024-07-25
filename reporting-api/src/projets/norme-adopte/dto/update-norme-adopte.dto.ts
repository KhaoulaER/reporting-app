import { PartialType } from '@nestjs/mapped-types';
import { CreateNormeAdopteDto } from './create-norme-adopte.dto';

export class UpdateNormeAdopteDto extends PartialType(CreateNormeAdopteDto) {
    evaluation: number;
    validation: boolean;
}
