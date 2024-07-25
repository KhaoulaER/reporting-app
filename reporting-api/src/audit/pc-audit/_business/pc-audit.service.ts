import { Injectable } from '@nestjs/common';
import { CreatePcAuditDto } from '../dto/create-pc-audit.dto';
import { UpdatePcAuditDto } from '../dto/update-pc-audit.dto';
import { PcAudit } from '../entities/pc-audit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Audit } from 'src/audit/entities/audit.entity';
import { Preuve } from 'src/normes/chapitres/points-controle/preuves/entities/preuve.entity';

@Injectable()
export class PcAuditService {
  constructor(
    @InjectRepository(PcAudit) private pcAuditRepository:Repository<PcAudit>,
    @InjectRepository(Audit) private auditRepository: Repository<Audit>,
    @InjectRepository(Preuve) private preuveRepository: Repository<Preuve>,
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
  async create(createPcAuditDto: CreatePcAuditDto[]): Promise<PcAudit[]> {
    const pcAudits = [];

    for (const dto of createPcAuditDto) {
        const pcAudit = new PcAudit();
        pcAudit.pc = dto.pc;
        pcAudit.niveau_maturite = dto.niveau_maturite;
        pcAudit.constat = dto.constat;
        pcAudit.commentaire = dto.commentaire;
        pcAudit.audit = dto.audit;

        // Ajout des preuves vérifiées
        /*if (dto.preuvesVerifies && dto.preuvesVerifies.length > 0) {
            pcAudit.preuvesVerifies = [];
            for (const pvv of dto.preuvesVerifies) {
                const preuve = await this.preuveRepository.findOne({ where: { id: pvv.id } });
                if (preuve) {
                    pcAudit.preuvesVerifies.push(preuve);
                }
            }
        }*/

        pcAudits.push(pcAudit);
    }

    return this.pcAuditRepository.save(pcAudits);
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
    // Obtenir la liste complète des chapitres de la norme adoptée
    const chapitres = await this.auditRepository.query(`
      SELECT "chapitre"."id", "chapitre"."titre"
      FROM "chapitre"
      JOIN "norme" ON "norme"."id" = "chapitre"."normeId"
      JOIN "norme_adopte" ON "norme"."id"="norme_adopte"."normeId"
      WHERE "norme_adopte"."id" = $1
    `, [normeAdopteId]);

    // Initialiser la structure des résultats
    const results = chapitres.map(chapitre => ({
      chapitre: chapitre.titre,
      nombre_pc_audit: 0,
      conformite: 0,
      result: maturiteLevels.map(niveau => ({
        niveau_maturite: niveau,
        nb_pc_audit: 0
      }))
    }));

    // Obtenir les résultats réels
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

      // Mettre à jour les résultats
      query.forEach(result => {
        const chapitreResult = results.find(r => r.chapitre === result.chapitre_titre);
        if (chapitreResult) {
          const maturiteResult = chapitreResult.result.find(r => r.niveau_maturite === niveau);
          if (maturiteResult) {
            maturiteResult.nb_pc_audit = parseInt(result.nombre_pc_audit, 10);
            chapitreResult.nombre_pc_audit += maturiteResult.nb_pc_audit; // Mettre à jour le total pour le chapitre
          }
        }
      });
    }

    // Calculer la conformité pour chaque chapitre
    results.forEach(chapitreResult => {
      let totalConformite = 0;
      chapitreResult.result.forEach(maturiteResult => {
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
      });

      if (chapitreResult.nombre_pc_audit > 0) {
        chapitreResult.conformite = totalConformite / chapitreResult.nombre_pc_audit;
      }
    });

    return results;
  }

  /*async getLatestAuditsByMaturityLevels(normeAdopteId: string, maturiteLevels: string[]): Promise<any> {
    // Obtenir la liste complète des chapitres de la norme adoptée
    const chapitres = await this.auditRepository.query(`
      SELECT "chapitre"."id", "chapitre"."titre"
      FROM "chapitre"
      JOIN "norme" ON "norme"."id" = "chapitre"."normeId"
      JOIN "norme_adopte" ON "norme"."id"="norme_adopte"."normeId"
      WHERE "norme_adopte"."id" = $1
    `, [normeAdopteId]);
  
    // Initialiser la structure des résultats
    const results = chapitres.map(chapitre => ({
      chapitre: chapitre.titre,
      result: maturiteLevels.map(niveau => ({
        niveau_maturite: niveau,
        nb_pc_audit: 0
      }))
    }));
  
    // Obtenir les résultats réels
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
  
      // Mettre à jour les résultats
      query.forEach(result => {
        const chapitreResult = results.find(r => r.chapitre === result.chapitre_titre);
        if (chapitreResult) {
          const maturiteResult = chapitreResult.result.find(r => r.niveau_maturite === niveau);
          if (maturiteResult) {
            maturiteResult.nb_pc_audit = parseInt(result.nombre_pc_audit, 10);
          }
        }
      });
    }
  
    return results;
  }*/
    
  
  


  findAll() {
    return `This action returns all pcAudit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pcAudit`;
  }

  update(id: number, updatePcAuditDto: UpdatePcAuditDto) {
    return `This action updates a #${id} pcAudit`;
  }

  remove(id: number) {
    return `This action removes a #${id} pcAudit`;
  }
}
