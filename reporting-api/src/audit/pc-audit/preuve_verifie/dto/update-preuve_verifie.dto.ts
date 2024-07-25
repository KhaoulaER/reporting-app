import { PartialType } from '@nestjs/mapped-types';
import { CreatePreuveVerifieDto } from './create-preuve_verifie.dto';

export class UpdatePreuveVerifieDto extends PartialType(CreatePreuveVerifieDto) {}
