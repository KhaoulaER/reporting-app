import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { ClientsService } from './_business/clients.service'; 
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4} from 'uuid';
import { of } from 'rxjs';
import * as path from 'path';
import { storage } from './middleware/file-upload.middleware';
import { RolesGuard } from 'src/gurads/roles.guard';
import { AuthInterceptor } from 'src/iam/interceptor/auth.interceptor';
import { Groups, Roles } from 'src/decos/roles.decorator';
import { AuthGuard } from 'src/gurads/auth.guard';

@Controller('clients')
@UseGuards(AuthGuard,RolesGuard)
@UseInterceptors(AuthInterceptor)
@Groups('/PROJECT_MANAGER')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Roles('clients-management')
  @Post()
  @UseInterceptors(FileInterceptor('logo', storage))
  async create(@Body() createClientDto: CreateClientDto, @UploadedFile() file: Express.Multer.File) {
    if (!createClientDto.nom || !createClientDto.email || !createClientDto.tel) {
      throw new BadRequestException('Missing required fields');
    }

    if (file) {
      createClientDto.logo = `assets/images/clients/${file.filename}`;
      console.log('file name: ', file.filename);
    }

    const newClient = await this.clientsService.create(createClientDto);
    return { message: 'Client created successfully', client: newClient };
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
