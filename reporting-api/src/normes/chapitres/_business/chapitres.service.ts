import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChapitreDto } from '../dto/create-chapitre.dto'; 
import { UpdateChapitreDto } from '../dto/update-chapitre.dto'; 
import { Chapitre } from '../entities/chapitre.entity';
import { Norme } from 'src/normes/entities/norme.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateNormeDto } from 'src/normes/dto/create-norme.dto';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class ChapitresService {
  constructor(
    @InjectRepository(Chapitre) private chapitreRepository:Repository<Chapitre>,
    @InjectRepository(Norme) private normeRepository:Repository<Norme>,
    private readonly entityManager: EntityManager
  ){}
 
  async create(normeId:string,createChapitreDto: CreateChapitreDto) {
    const norme = await this.normeRepository.findOne({where: {id:normeId}});
    if (!norme) {
      throw new NotFoundException('Norme not found');
    }
    const chapitre = this.chapitreRepository.create({ ...createChapitreDto, norme });
    return this.entityManager.save(chapitre);
  }

  async findAllByNorme(normeId:string): Promise<Chapitre[]>{
    return this.chapitreRepository.find({where: { norme: { id: normeId } }});
  }

  findAll() {
    return `This action returns all chapitres`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chapitre`;
  }

  async update(id: string, updateChapitreDto: UpdateChapitreDto) {
    const chapitre = await this.chapitreRepository.findOneBy({id});
    chapitre.titre=updateChapitreDto.titre;
    await this.entityManager.save(chapitre);
  }

  remove(id: string) {
    return this.chapitreRepository.delete(id);
  }
}
