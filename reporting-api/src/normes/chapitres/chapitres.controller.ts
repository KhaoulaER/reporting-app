import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChapitresService } from './_business/chapitres.service'; 
import { CreateChapitreDto } from './dto/create-chapitre.dto';
import { UpdateChapitreDto } from './dto/update-chapitre.dto';
import { Norme } from '../entities/norme.entity';
import { AuthGuard } from 'nest-keycloak-connect';
import { RolesGuard } from 'src/gurads/roles.guard';
import { Groups } from 'src/decos/roles.decorator';
//import { AuthInterceptor } from 'src/iam/interceptor/auth.interceptor';

@Controller('chapitres')
//@UseGuards(RolesGuard)
//@Groups('/ADMIN')
//@UseInterceptors(AuthInterceptor)
export class ChapitresController {
  constructor(private readonly chapitresService: ChapitresService) {}

  @Post(':normeId')
  create(@Param('normeId') normeId:string,@Body() createChapitreDto: CreateChapitreDto) {
    return this.chapitresService.create(normeId,createChapitreDto);
  }

  @Get(':id')
  findAllByNorme(@Param('id') normeId: string){
    return this.chapitresService.findAllByNorme(normeId);
  }

  @Get(':normeId/points')
  findChapitresWithPointsByNorme(@Param('normeId') normeId: string) {
    return this.chapitresService.findChapitresWithPointsByNorme(normeId);
  }

  @Get()
  findAll() {
    return this.chapitresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chapitresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChapitreDto: UpdateChapitreDto) {
    return this.chapitresService.update(id, updateChapitreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chapitresService.remove(id);
  }
}
