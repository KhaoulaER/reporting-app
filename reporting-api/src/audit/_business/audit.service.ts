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
  async create(normeId:string, auditeurId: string,createAuditDto: CreateAuditDto): Promise<Audit> {
    const norme_projet = await this.normeRepository.findOne({where: {id:normeId}})
    const auditeur = await this.auditeurRepository.findOne({where: {id:auditeurId}})
    if(!norme_projet){
      throw new NotFoundException('Norme invalide');
    }
    const audit = this.auditRepository.create({ ...createAuditDto,auditeur,norme_projet});
    this.entityManager.save(audit);
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
  
  

  findAll() {
    return this.auditRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} audit`;
  }

  update(id: number, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }
}
