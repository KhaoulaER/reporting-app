import { Injectable } from '@nestjs/common';
import { CreateNormeDto } from '../dto/create-norme.dto'; 
import { UpdateNormeDto } from '../dto/update-norme.dto'; 
import { Norme } from '../entities/norme.entity'; 
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NormesService {
  constructor(
    private readonly entityManager:EntityManager,
    @InjectRepository(Norme) private normeRepository: Repository<Norme>
  ){}
  async create(createNormeDto: CreateNormeDto) {
    const norme = new Norme(createNormeDto);
    await this.entityManager.save(norme);
  }

  async findAll() {
    return this.normeRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} norme`;
  }

  async update(id: string, updateNormeDto: UpdateNormeDto) {
    const norme = await this.normeRepository.findOneBy({id});
    norme.designation=updateNormeDto.designation;
    await this.entityManager.save(norme);
  }

  remove(id: string) {
    return this.normeRepository.delete(id);
  }
}
