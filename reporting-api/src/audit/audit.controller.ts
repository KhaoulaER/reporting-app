import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuditService } from './_business/audit.service'; 
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post(':normeId')
  create(@Param('normeId') normeId: string,@Param('auditeurId') auditeurId: string,@Param('auditeur') auditeur:User,@Body() createAuditDto: CreateAuditDto) {
    return this.auditService.create(normeId,auditeurId,createAuditDto);
  }

  @Get(':normeAdopId')
  findNCP(@Param('normeAdopId') normeAdopId: string){
    return this.auditService.findNormeChapitresWithPointsByNorme(normeAdopId);
  }

  @Get()
  findAll() {
    return this.auditService.findAll();
  }

 /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(+id);
  }
*/
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuditDto: UpdateAuditDto) {
    return this.auditService.update(+id, updateAuditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditService.remove(+id);
  }
}
