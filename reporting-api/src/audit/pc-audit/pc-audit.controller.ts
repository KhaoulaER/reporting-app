import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, UseInterceptors, ForbiddenException, Req } from '@nestjs/common';
import { PcAuditService } from './_business/pc-audit.service'; 
import { CreatePcAuditDto } from './dto/create-pc-audit.dto';
import { UpdatePcAuditDto } from './dto/update-pc-audit.dto';
import { PcAudit } from './entities/pc-audit.entity';
import { AuthGuard } from 'src/gurads/auth.guard';
import { RolesGuard } from 'src/gurads/roles.guard';
import { AuthInterceptor } from 'src/iam/interceptor/auth.interceptor';
import { Groups, Roles } from 'src/decos/roles.decorator';
import { AuditService } from '../_business/audit.service';
import { Request } from 'express';
import { NormeAdopteService } from 'src/projets/norme-adopte/_business/norme-adopte.service';

@Controller('pc-audit')
@UseGuards(AuthGuard,RolesGuard)
@UseInterceptors(AuthInterceptor)
export class PcAuditController {
  constructor(
    private readonly pcAuditService: PcAuditService, 
    private auditService:AuditService,
    private normeAdopteService:NormeAdopteService) {}
  @Post()
  @Groups('/AUDITOR','/PROJECT_MANAGER')
  //@Roles('project-fa8c5d80-0809-45d6-ab92-90c7a46dd97e-read-write')
  async createPcAudites(@Body() createPcAuditeDto: CreatePcAuditDto, @Req() request: Request): Promise<any> {
    
    // Proceed with the actual logic if the user has the right role
    return this.pcAuditService.create(createPcAuditeDto);
  }
    
  private async getProjectIdFromAudit(auditId: string): Promise<string> {
    const audit = await this.auditService.findAuditById(auditId); // Fetch audit by ID
    return audit?.norme_projet?.projet?.id; 
  }

  @Get('constats/:pointId/:normeAdopteId')
  async getConstatsByPoint(
    @Param('pointId') pointId: string,
    @Param('normeAdopteId') normeAdopteId: string,
  ) {
    return this.pcAuditService.findConstatsByPointNORMEAdopte(pointId, normeAdopteId);
  }
  @Get('preuves/:pointId/:normeAdopteId')
  async getPreuvesByPoint(
    @Param('pointId') pointId: string,
    @Param('normeAdopteId') normeAdopteId: string,
  ) {
    return this.pcAuditService.findPreuvesByPointNORMEAdopte(pointId, normeAdopteId);
  }
  @Get('niveau/:pointId/:normeAdopteId')
  async getNiveau(
    @Param('pointId') pointId: string,
    @Param('normeAdopteId') normeAdopteId: string,
  ){
    return this.pcAuditService.findNiveauByPointNORMEAdopte(pointId, normeAdopteId);

  }

  // Endpoint to get pc_audits by audit ID
  @Get(':auditId/pcs')
  async getPcsByAuditId(@Param('auditId') auditId: string): Promise<PcAudit[]> {
    return this.pcAuditService.getPcsByAuditId(auditId);
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
  async findToTalBYNV(@Param('id') id: string){
    const na= await this.normeAdopteService.findOne(id);
    console.log('norme adopte: ',na)
    console.log('echell: ',na?.norme?.echel,)
    
    const maturiteLevels=['N/A', 'Aucun','Initial', 'Reproductible', 'Défini', 'Maîtrisé', 'Optimisé'];
    const confLevels = ['Non_conforme','Partielle','Totale']
    if(na?.norme?.echel === '0->3'){
      return this.pcAuditService.getLatestAuditsByMaturityLevels(id,confLevels);
    }
    else{
    return this.pcAuditService.getLatestAuditsByMaturityLevels(id,maturiteLevels);
  }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePcAuditDto: UpdatePcAuditDto) {
    return this.pcAuditService.update(id, updatePcAuditDto);
  }

@Patch('delete-constat/:id')
async deleteConstat(@Param('id') pcAuditId: string): Promise<void> {
  return this.pcAuditService.deleteConstat(pcAuditId);
}
@Patch('delete-preuve/:id')
async deletePreuve(@Param('id') pcAuditId: string): Promise<void> {
  return this.pcAuditService.deletePreuve(pcAuditId);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pcAuditService.remove(+id);
  }
}
