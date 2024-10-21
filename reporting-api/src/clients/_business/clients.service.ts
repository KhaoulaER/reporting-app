import { Injectable } from '@nestjs/common';
import { CreateClientDto } from '../dto/create-client.dto'; 
import { UpdateClientDto } from '../dto/update-client.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private readonly entityManager:EntityManager
  ){}
  async create(createClientDto: CreateClientDto) {
    const client = new Client(createClientDto);
    await this.entityManager.save(client);
  }

  async findAll() {
    return this.clientRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.findOneBy({id});
    client.nom=updateClientDto.nom;
    client.nomcp=updateClientDto.nomcp;
    client.prenomcp=updateClientDto.prenomcp;
    client.email=updateClientDto.email;
    client.tel=updateClientDto.tel
    await this.entityManager.save(client);
  }

  remove(id: string) {
    return this.clientRepository.delete(id);
  }
}
