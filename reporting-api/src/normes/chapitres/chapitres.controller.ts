import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChapitresService } from './_business/chapitres.service'; 
import { CreateChapitreDto } from './dto/create-chapitre.dto';
import { UpdateChapitreDto } from './dto/update-chapitre.dto';
import { Norme } from '../entities/norme.entity';

@Controller('chapitres')
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
