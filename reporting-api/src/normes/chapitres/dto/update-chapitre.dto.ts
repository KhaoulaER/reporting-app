import { PartialType } from '@nestjs/mapped-types';
import { CreateChapitreDto } from './create-chapitre.dto';

export class UpdateChapitreDto extends PartialType(CreateChapitreDto) {
    readonly titre:string;
    readonly description:string;
}
