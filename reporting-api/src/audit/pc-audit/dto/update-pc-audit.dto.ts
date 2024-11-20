import { PartialType } from '@nestjs/mapped-types';
import { CreatePcAuditDto } from './create-pc-audit.dto';

export class UpdatePcAuditDto {
    readonly constat: string;
  recommandation: string;
}
