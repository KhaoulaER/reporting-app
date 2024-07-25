import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PreuveVerifieService } from './_business/preuve_verifie.service'; 
import { CreatePreuveVerifieDto } from './dto/create-preuve_verifie.dto';
import { UpdatePreuveVerifieDto } from './dto/update-preuve_verifie.dto';

@Controller('preuve-verifie')
export class PreuveVerifieController {
  constructor(private readonly preuveVerifieService: PreuveVerifieService) {}

  @Post()
  create(@Body() createPreuveVerifieDto: CreatePreuveVerifieDto) {
    return this.preuveVerifieService.create(createPreuveVerifieDto);
  }

  
  /*@Put('associate/:pcAuditId')
  associateWithPcAudit(
    @Param('pcAuditId') pcAuditId: string,
    @Body() preuveVerifieIds: string[]
  ) {
    return this.preuveVerifieService.associateWithPcAudit(pcAuditId, preuveVerifieIds);
  }
*/
  @Get()
  findAll() {
    return this.preuveVerifieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preuveVerifieService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreuveVerifieDto: UpdatePreuveVerifieDto) {
    return this.preuveVerifieService.update(+id, updatePreuveVerifieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preuveVerifieService.remove(+id);
  }
}
