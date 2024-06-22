import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePointsControleDto } from '../dto/create-points-controle.dto'; 
import { UpdatePointsControleDto } from '../dto/update-points-controle.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { PointsControle } from '../entities/points-controle.entity';
import { EntityManager, Repository } from 'typeorm';
import { Chapitre } from '../../entities/chapitre.entity';

@Injectable()
export class PointsControleService {
  constructor(
    @InjectRepository(PointsControle) private pcRepository:Repository<PointsControle>,
    @InjectRepository(Chapitre) private chapitreRepository:Repository<Chapitre>,
    private readonly entityManager: EntityManager
  ){}
  async create(chapitreId:string,createPointsControleDto: CreatePointsControleDto) {
    const chapitre = await this.chapitreRepository.findOne({ where: { id: chapitreId } });  // Corrected line
    if(!chapitre){
      throw new NotFoundException('Chapitre not found');

    }
    const pc = this.pcRepository.create({ ...createPointsControleDto,chapitre });
    this.entityManager.save(pc);
  }

  async findAllByChapitre(chapitreId:string): Promise<PointsControle[]>{
    return this.pcRepository.find({where: { chapitre: { id: chapitreId } }});
  }

  findAll() {
    return `This action returns all pointsControle`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pointsControle`;
  }

  async update(id: string, updatePointsControleDto: UpdatePointsControleDto) {
    const pc = await this.pcRepository.findOneBy({id});
    pc.designation=updatePointsControleDto.designation;
    pc.objectif=updatePointsControleDto.objectif;
    await this.entityManager.save(pc);  
  }

  async remove(id: string) {
    return this.chapitreRepository.delete(id);  }
}
