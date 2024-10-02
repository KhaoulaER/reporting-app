import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { AffectationService } from './_business/affectation.service'; 
import { CreateAffectationDto } from './dto/create-affectation.dto';
import { UpdateAffectationDto } from './dto/update-affectation.dto';
import { AuthGuard } from 'src/gurads/auth.guard';
import { RolesGuard } from 'src/gurads/roles.guard';
import { AuthInterceptor } from 'src/iam/interceptor/auth.interceptor';
import { Groups } from 'src/decos/roles.decorator';

@Controller('affectation')
@UseGuards(AuthGuard,RolesGuard)
@UseInterceptors(AuthInterceptor)
export class AffectationController {
  constructor(private readonly affectationService: AffectationService) {}

 /* @Post()
  create(@Body() auditeurId, @Param('projetId') projetId,@Body() createAffectationDto: CreateAffectationDto) {
    return this.affectationService.create(auditeurId,projetId,createAffectationDto);
  }*/
    @Post()
    @Groups('/PROJECT_MANAGER')
    create(@Body() createAffectationDto: CreateAffectationDto) {
      const {auditeur, projet } = createAffectationDto;
      console.log('affectation dto: ', createAffectationDto.droit)
      return this.affectationService.create(auditeur.keycloakId, projet.id, createAffectationDto);
    }

  @Get()
  findAll() {
    return this.affectationService.findAll();
  }


  @Get('/pauditeurs/:projetId')
  @Groups('/PROJECT_MANAGER')
  findByProjet(@Param('projetId') projetId:string){
    return this.affectationService.findByProjet(projetId);
  }
  @Get('/pnaffectaion/:auditeurId')
  @Groups('/AUDITOR')
  findByAuditeur(@Param('auditeurId') auditeurId:string){
    return this.affectationService.findByAuditeur(auditeurId);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.affectationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAffectationDto: UpdateAffectationDto) {
    return this.affectationService.update(id,updateAffectationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.affectationService.remove(id);
  }

  @Get('droit/:id')
  findDroit(@Param('id') id: string){
    return this.affectationService.findDroit(id);
  }

  @Groups('/AUDITOR')
  @Get('count-affectations/:auditorId')
  async countAffectations(@Param('auditorId') auditorId: string){
    const count = this.affectationService.countAffectations(auditorId)
    return count
  }
  @Groups('/AUDITOR')
  @Get('count-not-validated-pro/:auditorId')
  async countNotValidatedAffectations(@Param('auditorId') auditorId: string){
    const count = this.affectationService.countNotValidatedAffectations(auditorId);
    return count;
  }
}
