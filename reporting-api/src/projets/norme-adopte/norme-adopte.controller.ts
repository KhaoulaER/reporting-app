import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { NormeAdopteService } from './_business/norme-adopte.service'; 
import { CreateNormeAdopteDto } from './dto/create-norme-adopte.dto';
import { UpdateNormeAdopteDto } from './dto/update-norme-adopte.dto';
import { AuthGuard } from 'nest-keycloak-connect';
import { Groups } from 'src/decos/roles.decorator';
import { RolesGuard } from 'src/gurads/roles.guard';
//import { AuthInterceptor } from 'src/iam/interceptor/auth.interceptor';

@Controller('norme-adopte')
//@UseGuards(RolesGuard)
//@Groups('/PROJECT_MANAGER')
//@UseInterceptors(AuthInterceptor)
export class NormeAdopteController {
  constructor(private readonly normeAdopteService: NormeAdopteService) {}

  @Post()
  create(@Body('normerId') normeId, @Body('projetId') projetId,@Body() createNormeAdopteDto: CreateNormeAdopteDto) {
    return this.normeAdopteService.create(normeId, projetId,createNormeAdopteDto);
  }

  @Get()
  findAll() {
    return this.normeAdopteService.findAll();
  }

  @Get('pro-norme/:projectId')
  findByProjet(@Param('projectId') projectId:string){
    return this.normeAdopteService.findByProjet(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.normeAdopteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNormeAdopteDto: UpdateNormeAdopteDto) {
    return this.normeAdopteService.update(+id, updateNormeAdopteDto);
  }

  @Patch(':id/validation')
  async updateValidationState(@Param('id') id: string, @Body() updateNormeAdopteDto:UpdateNormeAdopteDto): Promise<any> {
    try {
      const updatedNormeAdopte = await this.normeAdopteService.updateAuditState(id, updateNormeAdopteDto.validation);
      if (!updatedNormeAdopte) {
        throw new NotFoundException(`NormeAdopte with id ${id} not found.`);
      }
      return {
        message: 'Validation state updated successfully.',
        normeAdopte: updatedNormeAdopte,
      };
    } catch (error) {
      throw new Error(`Failed to update validation state: ${error.message}`);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.normeAdopteService.remove(+id);
  }

  
}
