import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { ProjetsService } from './_business/projets.service'; 
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { Client } from 'src/clients/entities/client.entity';
import { RolesGuard } from 'src/gurads/roles.guard';
import { Groups, Roles } from 'src/decos/roles.decorator';
import { AuthInterceptor } from 'src/iam/interceptor/auth.interceptor';
import { AuthGuard } from 'src/gurads/auth.guard';
import { Request } from 'express';

@Controller('projets')
@UseGuards(AuthGuard,RolesGuard)
@UseInterceptors(AuthInterceptor)
export class ProjetsController {
  constructor(private readonly projetsService: ProjetsService) {}

  @Post(':projectManagerId')
  @Groups('/PROJECT_MANAGER')
  create(
    @Param('projectManagerId') projectManagerId: string,
    @Body() createProjetDto: CreateProjetDto
  ) {
    //console.log("req user: ", projectManagerId)
    return this.projetsService.create(projectManagerId, createProjetDto);
  }

  @Get()
  findAll() {
    return this.projetsService.findAll();
  }

  @Get(':auditeurId')
  @Groups('/AUDITOR')
  findByAuditeur(@Param('auditeurId') auditeurId: string){
    return this.projetsService.findByAffectation(auditeurId);
  }

  @Get('/mprojets/:managerId')
  @Groups('/PROJECT_MANAGER')
  findByManager(@Param('managerId') managerId:string){
    return this.projetsService.findByManager(managerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjetDto: UpdateProjetDto) {
    return this.projetsService.update(+id, updateProjetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projetsService.remove(id);
  }

  @Groups('/PROJECT_MANAGER')
  @Get('count-projects/:managerId')
  async countProjects(@Param('managerId') managerId:string){
    const count = this.projetsService.countProjects(managerId);
    return count;
  }
  //@UseGuards(AuthGuard) // Assuming you have an authentication guard
  @Groups('/PROJECT_MANAGER')
  @Get('count-not-validated/:managerId')
  async countProjectsNotValidatedByManager(@Param('managerId') managerId:string): Promise<number> {
    //const managerId = request.user.id; // Assuming manager's ID is stored in the authenticated user's session
    const count = await this.projetsService.countProjectsNotValidatedByManager(managerId);
    console.log('count pro: ', count)
    return count;
  }
  @Get('pro-not-validated/:managerId')
  findNotValidatedProjects(@Param('managerId') managerId:string){
    return this.projetsService.findProjectsNotValidated(managerId)
  }

}
