import { PartialType } from '@nestjs/mapped-types';
import { CreateNormeDto } from './create-norme.dto';

export class UpdateNormeDto extends PartialType(CreateNormeDto) {
    readonly designation?: string;
}
