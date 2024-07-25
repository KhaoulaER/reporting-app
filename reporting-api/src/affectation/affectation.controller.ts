import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AffectationService } from './_business/affectation.service'; 
import { CreateAffectationDto } from './dto/create-affectation.dto';
import { UpdateAffectationDto } from './dto/update-affectation.dto';

@Controller('affectation')
export class AffectationController {
  constructor(private readonly affectationService: AffectationService) {}

 /* @Post()
  create(@Body() auditeurId, @Param('projetId') projetId,@Body() createAffectationDto: CreateAffectationDto) {
    return this.affectationService.create(auditeurId,projetId,createAffectationDto);
  }*/
    @Post()
    create(@Body() createAffectationDto: CreateAffectationDto) {
      const { auditeur, projet } = createAffectationDto;
      return this.affectationService.create(auditeur.id, projet.id, createAffectationDto);
    }

  @Get()
  findAll() {
    return this.affectationService.findAll();
  }

  @Get('/pauditeurs/:projetId')
  findByProjet(@Param('projetId') projetId:string){
    return this.affectationService.findByProjet(projetId);
  }
  @Get('/pnaffectaion/:auditeurId')
  findByAuditeur(@Param('auditeurId') auditeurId:string){
    return this.affectationService.findByAuditeur(auditeurId);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.affectationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAffectationDto: UpdateAffectationDto) {
    return this.affectationService.update(+id, updateAffectationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.affectationService.remove(id);
  }
}
