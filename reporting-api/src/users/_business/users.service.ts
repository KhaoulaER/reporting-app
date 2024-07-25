import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { EntityManager, Repository } from 'typeorm';
import { Role, User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import KeycloakAdminClient from 'keycloak-admin';

//import { KeycloakService } from 'src/core/auth/keycloak/keycloak/keycloak.service';

@Injectable()
export class UsersService {
  constructor(
  private readonly entityManager:EntityManager,
  @InjectRepository(User) private userRepository: Repository<User>,
 
){}
  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email; 
    user.password = createUserDto.password;
    user.phone = createUserDto.phone;
    user.role = createUserDto.role;
    await this.entityManager.save(user);

    //AJOUTER L'UTILISATEUR DANS KEYCLOAK
    /*const keycloakUser = await this.keycloakService.createUser(createUserDto);
    user.id = keycloakUser.id;
    await this.entityManager.save(user);*/
  }

  findAll() {
    return `This action returns all users`;
  }

  async findAllByRole(role: Role): Promise<User[]>{
    return this.userRepository.find({where: {role}});
  }

  async findOne(email:string) {
    return this.userRepository.findOneBy({email});
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({id})
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.email = updateUserDto.email;
    user.role = updateUserDto.role;
    await this.entityManager.save(user);
    //MODIFIER L'UTILISATEUR DANS KEYCLOAK
    //await this.keycloakService.updateUser(user.id, updateUserDto);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    //SUPPTIMER L'UTILISATEUR DANS KEYCLOAK
    //await this.keycloakService.deleteUser(user.id);

    return this.userRepository.delete(id);
  }
}
