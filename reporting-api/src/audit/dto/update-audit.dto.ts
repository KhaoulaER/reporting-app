import { PartialType } from '@nestjs/mapped-types';
import { CreateAuditDto } from './create-audit.dto';

export class UpdateAuditDto extends PartialType(CreateAuditDto) {
    control:boolean;
    downloaded:boolean;
}
