import { Controller, Get, Post, Body, Patch, Param, Delete, Put, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './_business/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './config/upload.config';
//import { KeycloakService } from 'src/core/auth/keycloak/keycloak/keycloak.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    //private readonly keycloakService: KeycloakService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', multerOptions))
  create(@Body() createUserDto: CreateUserDto, @UploadedFile() photo:Express.Multer.File) {
    if(photo){
      createUserDto.photo = photo.filename;
    }
    
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':role')
  findAllByRole(@Param('role') role : Role){
    return this.usersService.findAllByRole(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  asyncremove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
