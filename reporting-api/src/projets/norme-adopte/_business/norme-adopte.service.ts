import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNormeAdopteDto } from '../dto/create-norme-adopte.dto'; 
import { UpdateNormeAdopteDto } from '../dto/update-norme-adopte.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { NormeAdopte } from '../entities/norme-adopte.entity';
import { EntityManager, Repository } from 'typeorm';
import { Norme } from 'src/normes/entities/norme.entity';
import { Projet } from 'src/projets/entities/projet.entity';

@Injectable()
export class NormeAdopteService {
  constructor(
    @InjectRepository(NormeAdopte) private normeAdopteRepository:Repository<NormeAdopte>,
    @InjectRepository(Norme) private normeRepository:Repository<Norme>,
    @InjectRepository(Projet) private projetRepository:Repository<Projet>,
    private readonly entityManager: EntityManager
  ){}
  async create(norme:Norme,projet:Projet,createNormeAdopteDto: CreateNormeAdopteDto) {
    //const norme = await this.normeRepository.findOne({where: {id:normeId}});
    //const projet = await this.projetRepository.findOne({where: {id:projetId}});
    if(!norme){
      throw new NotFoundException('Norme not found');
    }
    if(!projet){
      throw new NotFoundException('Norme not found');
    }

    const normeAdopte = this.normeAdopteRepository.create({ ...createNormeAdopteDto, norme, projet});
    return this.entityManager.save(normeAdopte);
  }

  async findByProjet(projetId: string): Promise<any[]> {
    if (!projetId) {
      throw new BadRequestException('Project ID is required');
    }
    return await this.normeAdopteRepository.find({
      where: { projet: { id: projetId } },
      relations: ['norme']
    });
  }

  findAll() {
    return this.normeAdopteRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} normeAdopte`;
  }

  update(id: number, updateNormeAdopteDto: UpdateNormeAdopteDto) {
    return `This action updates a #${id} normeAdopte`;
  }

  async updateAuditState(id: string, validation: boolean): Promise<NormeAdopte | undefined> {
    try {
      const normeAdopte = await this.normeAdopteRepository.findOne({where:{id:id}});

      if (!normeAdopte) {
        throw new Error(`NormeAdopte with id ${id} not found.`);
      }

      normeAdopte.validation = validation;
      const updatedNormeAdopte = await this.normeAdopteRepository.save(normeAdopte);

      return updatedNormeAdopte;
    } catch (error) {
      throw new Error(`Failed to update NormeAdopte validation state: ${error.message}`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} normeAdopte`;
  }
}
