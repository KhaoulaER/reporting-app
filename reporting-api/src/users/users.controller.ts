import { Controller, Get, Post, Body, Patch, Param, Delete, Put, BadRequestException, UseInterceptors, UploadedFile, Headers, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { UsersService } from './_business/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './config/upload.config';
import { RolesGuard } from 'src/gurads/roles.guard';
import { AuthGuard } from 'src/gurads/auth.guard';
import { Groups, Roles } from 'src/decos/roles.decorator';
import { AuthInterceptor } from 'src/iam/interceptor/auth.interceptor';
//import { KeycloakService } from 'src/core/auth/keycloak/keycloak/keycloak.service';

@Controller('users')
@UseGuards(AuthGuard,RolesGuard)

@UseInterceptors(AuthInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    //private readonly keycloakService: KeycloakService
  ) {}
  @Groups('/ADMIN')
  @Roles('users-management')
  @Post()
  async createUser(@Body() userData: Partial<User>) {
    //const token = authorizationHeader.replace('Bearer ', '');
    return this.usersService.create(userData);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Groups('/ADMIN','/PROJECT_MANAGER')
  @Get(':group')
  findAllByRole(@Param('group') group : string){
    return this.usersService.findUsersByGroup(group);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('users-management')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id') 
  @Roles('users-management')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
