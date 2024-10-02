import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePcAuditDto } from '../dto/create-pc-audit.dto';
import { UpdatePcAuditDto } from '../dto/update-pc-audit.dto';
import { PcAudit } from '../entities/pc-audit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Audit } from 'src/audit/entities/audit.entity';
import { Preuve } from 'src/normes/chapitres/points-controle/preuves/entities/preuve.entity';
import { NormeAdopte } from 'src/projets/norme-adopte/entities/norme-adopte.entity';
import { NormeAdopteService } from 'src/projets/norme-adopte/_business/norme-adopte.service';

@Injectable()
export class PcAuditService {
  constructor(
    @InjectRepository(PcAudit) private pcAuditRepository:Repository<PcAudit>,
    @InjectRepository(Audit) private auditRepository: Repository<Audit>,
    @InjectRepository(Preuve) private preuveRepository: Repository<Preuve>,
    private normeAdopteService: NormeAdopteService,
    private readonly entityManager: EntityManager
  ){}
 // create(createPcAuditDto: CreatePcAuditDto[]): Promise<PcAudit[]> {
    //const pcAudites = createPcAuditDto.map(dto => this.pcAuditRepository.create(dto));
    //return this.pcAuditRepository.save(pcAudites);
  //}

  /*async create(createPcAuditDto: CreatePcAuditDto[]): Promise<PcAudit[]> {
    const pcAudits = await Promise.all(createPcAuditDto.map(async dto => {
      const pcAudit = new PcAudit();
      pcAudit.pc = dto.pc;
      pcAudit.niveau_maturite = dto.niveau_maturite;
      pcAudit.constat = dto.constat;
      pcAudit.audit = dto.audit;
      return pcAudit;
    }));
    return this.pcAuditRepository.save(pcAudits);
  }*/


  /////////// CREATION PCA AVEC PREUVES /////////////////////////
  async create(createPcAuditDto: CreatePcAuditDto): Promise<PcAudit> {
    //const pcAudits = [];

        const pcAudit = new PcAudit();
        pcAudit.pc = createPcAuditDto.pc;
        pcAudit.niveau_maturite = createPcAuditDto.niveau_maturite;
        pcAudit.constat = createPcAuditDto.constat;
        pcAudit.preuve = createPcAuditDto.preuve;
        pcAudit.recommandation=createPcAuditDto.recommandation
        pcAudit.audit = createPcAuditDto.audit;

    return this.pcAuditRepository.save(pcAudit);
  }

  /////Dernier PCA pour une norme adopte
  async findLatestEvaluationsByNorme(normeAdopId: string): Promise<PcAudit[]> {
    const latest= this.pcAuditRepository
      .createQueryBuilder('pc_audit_latest')
      .select('DISTINCT ON (pc.id) pc_audit_latest.*')
      .innerJoin('pc_audit_latest.audit', 'audit')
      .innerJoin('audit.norme_projet', 'normeAdopte')
      .innerJoin('pc_audit_latest.pc', 'pc')
      .where('normeAdopte.id = :normeAdopId', { normeAdopId })
      .orderBy('pc.id')
      .addOrderBy('pc_audit_latest.createdAt', 'DESC');
      const latestPcAudits = await latest.getRawMany();
      return latestPcAudits;

  }

  async getLatestAuditsByMaturityLevels(normeAdopteId: string, maturiteLevels: string[]): Promise<any> {
    // Fetch the norm and its echel value
    const norme = await this.auditRepository.query(`
      SELECT "norme"."echel"
      FROM "norme"
      JOIN "norme_adopte" ON "norme"."id" = "norme_adopte"."normeId"
      WHERE "norme_adopte"."id" = $1
    `, [normeAdopteId]);
  
    const echel = norme[0]?.echel;
    console.log('norme: ',norme)
  
    // Fetch all chapters for the adopted norm
    const chapitres = await this.auditRepository.query(`
      SELECT "chapitre"."id", "chapitre"."titre"
      FROM "chapitre"
      JOIN "norme" ON "norme"."id" = "chapitre"."normeId"
      JOIN "norme_adopte" ON "norme"."id"="norme_adopte"."normeId"
      WHERE "norme_adopte"."id" = $1
    `, [normeAdopteId]);
  
    // Initialize the structure for results
    const results = chapitres.map(chapitre => ({
      chapitre: chapitre.titre,
      nombre_pc_audit: 0,
      conformite: 0,
      result: maturiteLevels.map(niveau => ({
        niveau_maturite: niveau,
        nb_pc_audit: 0
      }))
    }));
  
    // Fetch actual results
    for (const niveau of maturiteLevels) {
      const query = await this.auditRepository.query(`
        WITH latest_pc_audit AS (
          SELECT DISTINCT ON ("pc_audit"."pcId") 
                 "pc_audit"."id",
                 "pc_audit"."pcId",
                 "pc_audit"."niveau_maturite",
                 "pc_audit"."auditId",
                 "pc_audit"."createdAt",
                 "points_controle"."chapitreId"
          FROM "pc_audit"
          JOIN "points_controle" ON "pc_audit"."pcId" = "points_controle"."id"
          ORDER BY "pc_audit"."pcId", "pc_audit"."createdAt" DESC
        )
        SELECT "chapitre"."titre" AS chapitre_titre,
               COUNT(latest_pc_audit."id") AS nombre_pc_audit
        FROM latest_pc_audit
        JOIN "audit" ON latest_pc_audit."auditId" = "audit"."id"
        JOIN "norme_adopte" ON "audit"."normeProjetId" = "norme_adopte"."id"
        JOIN "chapitre" ON latest_pc_audit."chapitreId" = "chapitre"."id"
        WHERE "norme_adopte"."id" = $1
        AND latest_pc_audit."niveau_maturite" = $2
        GROUP BY "chapitre"."id", "chapitre"."titre"
        ORDER BY nombre_pc_audit DESC;
      `, [normeAdopteId, niveau]);
  
      // Update results
      query.forEach(result => {
        const chapitreResult = results.find(r => r.chapitre === result.chapitre_titre);
        if (chapitreResult) {
          const maturiteResult = chapitreResult.result.find(r => r.niveau_maturite === niveau);
          if (maturiteResult) {
            maturiteResult.nb_pc_audit = parseInt(result.nombre_pc_audit, 10);
            chapitreResult.nombre_pc_audit += maturiteResult.nb_pc_audit;
          }
        }
      });
    }
  
    // Calculate conformity for each chapter
    results.forEach(chapitreResult => {
      let totalConformite = 0;
  
      chapitreResult.result.forEach(maturiteResult => {
        if (echel === '0->3') {
          // Switch for echel 0->3
          switch (maturiteResult.niveau_maturite) {
            case 'Non_conforme':
              totalConformite += maturiteResult.nb_pc_audit * 0;
              break;
            case 'Partielle':
              totalConformite += maturiteResult.nb_pc_audit * 0.5;
              break;
            case 'Totale':
              totalConformite += maturiteResult.nb_pc_audit * 1;
              break;
          }
        }
        else {
          // Switch for echel 0->5
          switch (maturiteResult.niveau_maturite) {
            case 'Optimisé':
              totalConformite += maturiteResult.nb_pc_audit * 1;
              break;
            case 'Maîtrisé':
              totalConformite += maturiteResult.nb_pc_audit * 0.8;
              break;
            case 'Défini':
              totalConformite += maturiteResult.nb_pc_audit * 0.6;
              break;
            case 'Reproductible':
              totalConformite += maturiteResult.nb_pc_audit * 0.4;
              break;
            case 'Initial':
              totalConformite += maturiteResult.nb_pc_audit * 0.2;
              break;
          }
        } 
      });
  
      if (chapitreResult.nombre_pc_audit > 0) {
        chapitreResult.conformite = totalConformite / chapitreResult.nombre_pc_audit;
      }
    });
  
    return results;
  }
  
  // Method to find all constats by a control point and normeAdopte
  async findConstatsByPointNORMEAdopte(pointId: string, normeAdopteId: string): Promise<any[]> {
    return this.pcAuditRepository
      .createQueryBuilder('pc_audit')
      .leftJoinAndSelect('pc_audit.audit', 'audit')
      .leftJoinAndSelect('audit.norme_projet', 'norme_adopte')
      .where('pc_audit.pc.id = :pointId', { pointId })
      .andWhere('norme_adopte.id = :normeAdopteId', { normeAdopteId })
      .andWhere('pc_audit.constat != :empty', { empty: '' })
      .distinctOn(['pc_audit.constat']) // Use distinctOn to remove duplicates based on constat
      .select(['pc_audit.constat']) // Select distinct constats
      .addSelect(['pc_audit.id'])
      .addSelect('audit.date_audit') // Add date_audit for ordering
      .orderBy('pc_audit.constat') // First, order by constat to satisfy distinctOn
      .addOrderBy('audit.date_audit', 'ASC') // Then, order by date_audit
      .getMany();
  }

  // Method to find all constats by a control point and normeAdopte
  async findPreuvesByPointNORMEAdopte(pointId: string, normeAdopteId: string): Promise<any[]> {
    return this.pcAuditRepository
      .createQueryBuilder('pc_audit')
      .leftJoinAndSelect('pc_audit.audit', 'audit')
      .leftJoinAndSelect('audit.norme_projet', 'norme_adopte')
      .where('pc_audit.pc.id = :pointId', { pointId })
      .andWhere('norme_adopte.id = :normeAdopteId', { normeAdopteId })
      .andWhere('pc_audit.preuve != :empty', { empty: '' })
      .distinctOn(['pc_audit.preuve']) // Use distinctOn to remove duplicates based on constat
      .select(['pc_audit.preuve']) // Select distinct constats
      .addSelect(['pc_audit.id'])
      .addSelect('audit.date_audit') // Add date_audit for ordering
      .orderBy('pc_audit.preuve') // First, order by constat to satisfy distinctOn
      .addOrderBy('audit.date_audit', 'ASC') // Then, order by date_audit
      .getMany();
  }
  // Method to find all constats by a control point and normeAdopte
  async findNiveauByPointNORMEAdopte(pointId: string, normeAdopteId: string): Promise<any> {
    return this.pcAuditRepository
      .createQueryBuilder('pc_audit')
      .leftJoinAndSelect('pc_audit.audit', 'audit')
      .leftJoinAndSelect('audit.norme_projet', 'norme_adopte')
      .where('pc_audit.pc.id = :pointId', { pointId })
      .andWhere('norme_adopte.id = :normeAdopteId', { normeAdopteId })
      .andWhere('pc_audit.niveau_maturite != :empty', { empty: '' })
      .select(['pc_audit.niveau_maturite']) // Select distinct constats
      .addSelect(['pc_audit.id'])
      .addSelect('audit.date_audit') // Add date_audit for ordering
      .getOne()
  }
  findAll() {
    return `This action returns all pcAudit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pcAudit`;
  }

  async update(id: string, updatePcAuditDto: UpdatePcAuditDto) {
    const pc_audit = await this.pcAuditRepository.findOneBy({id});
    pc_audit.recommandation=updatePcAuditDto.recommendations;
    return this.entityManager.save(pc_audit);
  }

  remove(id: number) {
    return `This action removes a #${id} pcAudit`;
  }

  async deleteConstat(pcAuditId: string): Promise<void> {
    const pcAudit = await this.pcAuditRepository.findOne({ where: { id: pcAuditId } });
    
    if (pcAudit) {
      pcAudit.constat = null; // Update constat to null to effectively remove it
      await this.pcAuditRepository.save(pcAudit);
    } else {
      throw new NotFoundException(`PcAudit with ID ${pcAuditId} not found`);
    }
  }
  
  async deletePreuve(pcAuditId: string): Promise<void> {
    const pcAudit = await this.pcAuditRepository.findOne({ where: { id: pcAuditId } });
    
    if (pcAudit) {
      pcAudit.constat = null; // Update constat to null to effectively remove it
      await this.pcAuditRepository.save(pcAudit);
    } else {
      throw new NotFoundException(`PcAudit with ID ${pcAuditId} not found`);
    }
  }

  // Method to get all pc_audits for a given audit ID
  async getPcsByAuditId(auditId: string): Promise<any[]> {
    return this.pcAuditRepository.find({
      where: { audit: { id: auditId } },
      relations: ['pc', 'pc.chapitre','audit','audit.norme_projet','audit.norme_projet.norme','audit.norme_projet.projet','audit.norme_projet.projet.client'], // Including PointsControle and Chapitre
    });
  }
}
