import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req, NotFoundException } from '@nestjs/common';
import { AuditService } from './_business/audit.service'; 
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/gurads/auth.guard';
import { RolesGuard } from 'src/gurads/roles.guard';
import { AuthInterceptor } from 'src/iam/interceptor/auth.interceptor';
import { Groups } from 'src/decos/roles.decorator';

@Controller('audit')
@UseGuards(AuthGuard,RolesGuard)
@UseInterceptors(AuthInterceptor)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Groups('/PROJECT_MANAGER','/AUDITOR')
  @Post(':normeId')
create(
  @Param('normeId') normeId: string, 
  @Req() req: any,  // Using the request object to access authenticated user
  @Body() createAuditDto: CreateAuditDto
) {
  const auditeurId = req.user?.keycloakId;  // Safely accessing keycloakId from the authenticated user
  if (!auditeurId) {
    console.error("Auditeur ID is missing from the authenticated user");
    throw new Error('Auditeur ID not found');
  }
  console.log("Audit for auditeurId: ", auditeurId);
  return this.auditService.create(normeId, auditeurId, createAuditDto);
}

  @Groups('/PROJECT_MANAGER','/AUDITOR')
  @Get(':normeAdopId')
  findNCP(@Param('normeAdopId') normeAdopId: string){
    return this.auditService.findNormeChapitresWithPointsByNorme(normeAdopId);
  }

  @Get()
  findAll() {
    return this.auditService.findAll();
  }

 /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(+id);
  }
*/
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuditDto: UpdateAuditDto) {
    return this.auditService.update(+id, updateAuditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditService.remove(+id);
  }

  @Groups('/PROJECT_MANAGER')
  @Get('count-audits/:managerId')
  async countTotalAudits(@Param('managerId') managerId: string){
    const count = this.auditService.countTotalAudits(managerId);
    return count;
  }

  @Groups('/PROJECT_MANAGER')
  @Get('count-not-controlled/:managerId')
  async countProjectsNotValidatedByManager(@Param('managerId') managerId:string): Promise<number> {
    //const managerId = request.user.id; // Assuming manager's ID is stored in the authenticated user's session
    const count = await this.auditService.countAuditsWithControlFalseByManager(managerId);
    console.log('count pro: ', count)
    return count;
  }

  @Groups('/PROJECT_MANAGER')
  @Get('audits-not-controlled/:managerId')
  findNotControlledAudits(@Param('managerId') managerId:string){
    return this.auditService.getAuditsWithControlFalse(managerId)
  }

  @Groups('/PROJECT_MANAGER')
  @Get('audits-history/:managerId')
  findAuditsHistory(@Param('managerId') managerId:string){
    return this.auditService.getAuditHistory(managerId)
  }

  @Groups('/PROJECT_MANAGER')
  @Patch(':id/control')
  async updatecontrolState(@Param('id') id: string, @Body() updateAuditDto:UpdateAuditDto): Promise<any> {
    try {
      const updatedAudit = await this.auditService.updateAuditState(id, updateAuditDto.control);
      if (!updatedAudit) {
        throw new NotFoundException(`Audit with id ${id} not found.`);
      }
      return {
        message: 'control state updated successfully.',
        audit: updatedAudit,
      };
    } catch (error) {
      throw new Error(`Failed to update control state: ${error.message}`);
    }
  }

  @Groups('/PROJECT_MANAGER','/AUDITOR')
  @Patch(':id/downloaded')
  async updateDownloadState(@Param('id') id: string, @Body() UpdateAuditDto:UpdateAuditDto): Promise<any>{
    try{
      const updateAudit = await this.auditService.updateDownloadState(id,UpdateAuditDto.downloaded);
      if (!updateAudit) {
        throw new NotFoundException(`Audit with id ${id} not found.`);
      }
      return {
        message: 'control state updated successfully.',
        audit: updateAudit,
      };
    }catch (error) {
      throw new Error(`Failed to update control state: ${error.message}`);
    }
  }

  @Get('first-auditor/:id')
  findFirstAuditor(@Param('id') id: string): Promise<User | null>{
    return this.auditService.getFirstAuditorForNormeAdopte(id);
  }
}
