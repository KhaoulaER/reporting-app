import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreuvesService } from './_business/preuves.service'; 
import { CreatePreuveDto } from './dto/create-preuve.dto';
import { UpdatePreuveDto } from './dto/update-preuve.dto';

@Controller('preuves')
export class PreuvesController {
  constructor(private readonly preuvesService: PreuvesService) {}

  @Post(':pcId')
  create(@Param('pcId') pcId: string,@Body() createPreuveDto: CreatePreuveDto) {
    return this.preuvesService.create(pcId,createPreuveDto);
  }

  @Get(':pcId')
  findAllByPc(@Param('pcId') pcId: string){
    return this.preuvesService.findAllByPc(pcId);
  }

  @Get()
  findAll() {
    return this.preuvesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preuvesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreuveDto: UpdatePreuveDto) {
    return this.preuvesService.update(+id, updatePreuveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preuvesService.remove(id);
  }
}
