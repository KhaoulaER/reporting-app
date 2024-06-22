import { PartialType } from '@nestjs/mapped-types';
import { CreatePreuveDto } from './create-preuve.dto';

export class UpdatePreuveDto extends PartialType(CreatePreuveDto) {}
