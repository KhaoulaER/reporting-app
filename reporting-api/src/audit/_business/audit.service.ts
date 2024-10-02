import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuditDto } from '../dto/create-audit.dto';
import { UpdateAuditDto } from '../dto/update-audit.dto'; 
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NormeAdopte } from 'src/projets/norme-adopte/entities/norme-adopte.entity';
import { EntityManager, Repository } from 'typeorm';
import { Audit } from '../entities/audit.entity';
import { Norme } from 'src/normes/entities/norme.entity';
import { PcAuditService } from '../pc-audit/_business/pc-audit.service';
import { PcAudit } from '../pc-audit/entities/pc-audit.entity';
import { AuditResult } from '../_result/audit-result.interface';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(NormeAdopte) private normeRepository: Repository<NormeAdopte>,
    @InjectRepository(User) private auditeurRepository: Repository<User>,
    @InjectRepository(Audit) private auditRepository: Repository<Audit>,
    private readonly entityManager: EntityManager,
    private pcAuditService: PcAuditService
  ){}
 /* async create(normeId:string, auditeurId: string,createAuditDto: CreateAuditDto): Promise<Audit> {
    const norme_projet = await this.normeRepository.findOne({where: {id:normeId}})
    const auditeur = await this.auditeurRepository.findOneBy({keycloakId:auditeurId})
    console.log('audit auditor service: ',auditeur)
    if(!norme_projet){
      throw new NotFoundException('Norme invalide');
    }
    const audit = this.auditRepository.create({ ...createAuditDto,auditeur,norme_projet});
    this.entityManager.save(audit);
    return audit;
  }*/

    async create(normeId: string, auditeurId: string, createAuditDto: CreateAuditDto): Promise<Audit> {
      const norme_projet = await this.normeRepository.findOne({ where: { id: normeId } });
      const auditeur = await this.auditeurRepository.findOneBy({ keycloakId: auditeurId });
      
      if (!norme_projet) {
        throw new NotFoundException('Norme invalide');
      }
    
      const audit = this.auditRepository.create({ ...createAuditDto, auditeur, norme_projet });
      await this.entityManager.save(audit);
      
      return audit;
    }

  async findNormeChapitresWithPointsByNorme(normeAdopId: string): Promise<{nms:NormeAdopte[],latestEvaluations:PcAudit[]}> {
    const nms = await this.normeRepository.find({
      where: { id: normeAdopId },
      relations: [
        'norme',
        'projet',
        'projet.client',
        'norme.chapitre',
        'norme.chapitre.pointsControle',
        'norme.chapitre.pointsControle.preuve',
      ],
    });
    if (!nms) {
      throw new NotFoundException('Norme adoptée non trouvée');
    }

    const latestEvaluations = await this.pcAuditService.findLatestEvaluationsByNorme(normeAdopId);
    return{
      nms,
      latestEvaluations
    }
  }
  
   //audit verfication
   
  async updateAuditState(id: string, control: boolean): Promise<Audit | undefined> {
    try {
      const audit = await this.auditRepository.findOne({where:{id:id}});

      if (!audit) {
        throw new Error(`Audit with id ${id} not found.`);
      }

      audit.control = control;
      const updatedAudit = await this.auditRepository.save(audit);

      return updatedAudit;
    } catch (error) {
      throw new Error(`Failed to update Audit control state: ${error.message}`);
    }
  }
  

  findAll() {
    return this.auditRepository.find();
  }

  async findAuditById(auditId: string): Promise<any> {
    // Implement logic to find and return the audit entity, which includes the associated project
    return await this.auditRepository.findOne({ where: { id: auditId }, relations: ['norme_projet', 'norme_projet.projet'] });
  }


  update(id: number, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }

  //total audits
  async countTotalAudits(managerId:string):Promise<number>{
    return await this.auditRepository
    .createQueryBuilder('audit')
        .leftJoin('audit.norme_projet', 'normeAdopte')
        .leftJoin('normeAdopte.projet', 'projet')
        .leftJoin('projet.project_manager', 'user')
        .where('user.keycloakId = :managerId', { managerId })
        .getCount();
  }


  //Count audits
  async countAuditsWithControlFalseByManager(managerKeycloakId: string): Promise<number> {
    return await this.auditRepository
        .createQueryBuilder('audit')
        .leftJoin('audit.norme_projet', 'normeAdopte')
        .leftJoin('normeAdopte.projet', 'projet')
        .leftJoin('projet.project_manager', 'user')
        .where('user.keycloakId = :managerKeycloakId', { managerKeycloakId })
        .andWhere('audit.control = :control', { control: false })
        .andWhere('normeAdopte.validation = :validation', { validation: false })
        .getCount();
}

//find audits
async getAuditsWithControlFalse(managerId: string) {
  return await this.auditRepository
    .createQueryBuilder('audit')
    .leftJoinAndSelect('audit.norme_projet', 'normeAdopte') // Include related normeAdopte entity
    .leftJoinAndSelect('normeAdopte.projet', 'projet') // Include related projet entity
    .leftJoinAndSelect('projet.client','client')
    .leftJoinAndSelect('normeAdopte.norme', 'norme')
    .leftJoinAndSelect('projet.project_manager', 'projectManager') // Include related projectManager
    .leftJoinAndSelect('audit.auditeur', 'auditeur') // Include related auditeur entity
    .where('projectManager.keycloakId = :managerId', { managerId })
    .andWhere('audit.control = :control', { control: false })
    .andWhere('normeAdopte.validation = :validation', { validation: false })
    .getMany();
}
}
