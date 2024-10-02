import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { PointsControleService } from './_business/points-controle.service'; 
import { CreatePointsControleDto } from './dto/create-points-controle.dto';
import { UpdatePointsControleDto } from './dto/update-points-controle.dto';
import { AuthGuard } from 'nest-keycloak-connect';
import { RolesGuard } from 'src/gurads/roles.guard';
//import { AuthInterceptor } from 'src/iam/interceptor/auth.interceptor';
import { Groups } from 'src/decos/roles.decorator';

@Controller('points-controle')
//@UseGuards(RolesGuard)
//@Groups('/ADMIN')
//@UseInterceptors(AuthInterceptor)
export class PointsControleController {
  constructor(private readonly pointsControleService: PointsControleService) {}

  @Post(':chapitreId')
  create(@Param('chapitreId') chapitreId:string,@Body() createPointsControleDto: CreatePointsControleDto) {
    return this.pointsControleService.create(chapitreId,createPointsControleDto);
  }

  @Get(':id')
  findAllByChapitre(@Param('id') chapitreId: string){
    return this.pointsControleService.findAllByChapitre(chapitreId);
  }

  @Get()
  findAll() {
    return this.pointsControleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointsControleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePointsControleDto: UpdatePointsControleDto) {
    return this.pointsControleService.update(id, updatePointsControleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointsControleService.remove(id);
  }
}
