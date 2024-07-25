import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAffectationDto } from '../dto/create-affectation.dto'; 
import { UpdateAffectationDto } from '../dto/update-affectation.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Affectation } from '../entities/affectation.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Projet } from 'src/projets/entities/projet.entity';

@Injectable()
export class AffectationService {
  constructor(
    @InjectRepository(Affectation) private affectationRepository:Repository<Affectation>,
    @InjectRepository(User) private userRepository:Repository<User>,
    @InjectRepository(Projet) private projetRepository:Repository<Projet>,
    private readonly entityManager: EntityManager
  ){}
 /* async create(userId:string,projetId:string,createAffectationDto: CreateAffectationDto) {
    const auditeur = await this.userRepository.findOne({where: {id:userId}});
    const projet = await this.projetRepository.findOne({where: {id:projetId}});
    if(!auditeur){
      throw new NotFoundException('Norme not found');
    }
    if(!projet){
      throw new NotFoundException('Norme not found');
    }

    const affectation = this.affectationRepository.create({ ...createAffectationDto, auditeur, projet});
    return this.entityManager.save(affectation);
  }*/

    async create(auditeurId: string, projetId: string, createAffectationDto: CreateAffectationDto): Promise<Affectation> {
      const auditeur = await this.userRepository.findOne({ where: { id: auditeurId } });
      const projet = await this.projetRepository.findOne({ where: { id: projetId } });
      
      if (!auditeur) {
        throw new NotFoundException('Auditeur not found');
      }
      if (!projet) {
        throw new NotFoundException('Projet not found');
      }
  
      const affectation = this.affectationRepository.create({
        ...createAffectationDto,
        auditeur,
        projet
      });
      return this.affectationRepository.save(affectation);
    }

  //les affectation par auditeur
  async findByAuditeur(auditeurId: string): Promise<any[]> {
    return this.affectationRepository.createQueryBuilder('affectation')
        .leftJoinAndSelect('affectation.auditeur', 'auditeur')
        .leftJoinAndSelect('affectation.projet', 'projet')
        .leftJoinAndSelect('projet.normeAdopte', 'normeAdopte')
        .leftJoinAndSelect('normeAdopte.norme','norme')
        .where('affectation.auditeur.id = :auditeurId', { auditeurId })
        .getMany();
}
  async findByProjet(projetId:string): Promise<any[]>{
    return await this.affectationRepository.find({where: {projet:{id:projetId}},
      relations: ['auditeur','projet']
    })
  }
  findAll() {
    return `This action returns all affectation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} affectation`;
  }

  update(id: number, updateAffectationDto: UpdateAffectationDto) {
    return `This action updates a #${id} affectation`;
  }

  async remove(id: string) {
    return this.affectationRepository.delete(id);
  }
}
