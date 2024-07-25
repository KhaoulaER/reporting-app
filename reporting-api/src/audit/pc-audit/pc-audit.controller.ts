import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PcAuditService } from './_business/pc-audit.service'; 
import { CreatePcAuditDto } from './dto/create-pc-audit.dto';
import { UpdatePcAuditDto } from './dto/update-pc-audit.dto';
import { PcAudit } from './entities/pc-audit.entity';

@Controller('pc-audit')
export class PcAuditController {
  constructor(private readonly pcAuditService: PcAuditService) {}
  @Post()
  async createPcAudites(@Body() createPcAuditeDto: CreatePcAuditDto[]): Promise<PcAudit[]> {
    return this.pcAuditService.create(createPcAuditeDto);
  }


  @Get()
  findAll() {
    return this.pcAuditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pcAuditService.findOne(+id);
  }
  @Get(':id/conformite')
  findToTalBYNV(@Param('id') id: string){
    const maturiteLevels=['N/A', 'Initial', 'Reproductible', 'Défini', 'Maîtrisé', 'Optimisé'];
    return this.pcAuditService.getLatestAuditsByMaturityLevels(id,maturiteLevels);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePcAuditDto: UpdatePcAuditDto) {
    return this.pcAuditService.update(+id, updatePcAuditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pcAuditService.remove(+id);
  }
}
