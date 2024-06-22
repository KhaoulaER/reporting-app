import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePreuveDto } from '../dto/create-preuve.dto'; 
import { UpdatePreuveDto } from '../dto/update-preuve.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { PointsControle } from '../../entities/points-controle.entity';
import { EntityManager, Repository } from 'typeorm';
import { Preuve } from '../entities/preuve.entity';

@Injectable()
export class PreuvesService {
  constructor(
    @InjectRepository(PointsControle) private pcRepository:Repository<PointsControle>,
    @InjectRepository(Preuve) private preuveRepository:Repository<Preuve>,
    private readonly entityManager: EntityManager
  ){}
  async create(pcId: string,createPreuveDto: CreatePreuveDto) {
    const point_controle = await this.pcRepository.findOne({where:{id: pcId}});
    if(!point_controle){
      throw new NotFoundException('pc not found');

    }
    const preuve = this.preuveRepository.create({  ...createPreuveDto, point_controle});
    this.entityManager.save(preuve);
  }

  async findAllByPc(pcId:string): Promise<Preuve[]>{
    return this.preuveRepository.find({where: {point_controle: {id: pcId}}});
    
  }

  findAll() {
    return `This action returns all preuves`;
  }

  findOne(id: number) {
    return `This action returns a #${id} preuve`;
  }

  update(id: number, updatePreuveDto: UpdatePreuveDto) {
    return `This action updates a #${id} preuve`;
  }

  remove(id: string) {
    return this.preuveRepository.delete(id);
  }
}
