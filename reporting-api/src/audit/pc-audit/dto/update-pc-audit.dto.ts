import { PartialType } from '@nestjs/mapped-types';
import { CreatePcAuditDto } from './create-pc-audit.dto';

export class UpdatePcAuditDto extends PartialType(CreatePcAuditDto) {
    constat: string
    recommendations: string
}
