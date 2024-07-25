import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjetsService } from './_business/projets.service'; 
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { Client } from 'src/clients/entities/client.entity';

@Controller('projets')
export class ProjetsController {
  constructor(private readonly projetsService: ProjetsService) {}

  @Post(':projectManagerId')
  create(
    @Param('projectManagerId') projectManagerId: string,
    @Body() createProjetDto: CreateProjetDto
  ) {
    return this.projetsService.create(projectManagerId, createProjetDto);
  }

  @Get()
  findAll() {
    return this.projetsService.findAll();
  }

  @Get(':auditeurId')
  findByAuditeur(@Param('auditeurId') auditeurId: string){
    return this.projetsService.findByAffectation(auditeurId);
  }

  @Get('/mprojets/:managerId')
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
    return this.projetsService.remove(+id);
  }
}
