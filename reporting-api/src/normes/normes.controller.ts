import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NormesService } from './_business/normes.service'; 
import { CreateNormeDto } from './dto/create-norme.dto';
import { UpdateNormeDto } from './dto/update-norme.dto';

@Controller('normes')
export class NormesController {
  constructor(private readonly normesService: NormesService) {}

  @Post()
  create(@Body() createNormeDto: CreateNormeDto) {
    return this.normesService.create(createNormeDto);
  }

  @Get()
  findAll() {
    return this.normesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.normesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNormeDto: UpdateNormeDto) {
    return this.normesService.update(id, updateNormeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.normesService.remove(id);
  }
}
