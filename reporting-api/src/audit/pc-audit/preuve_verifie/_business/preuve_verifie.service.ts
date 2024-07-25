import { Injectable } from '@nestjs/common';
import { CreatePreuveVerifieDto } from '../dto/create-preuve_verifie.dto';
import { UpdatePreuveVerifieDto } from '../dto/update-preuve_verifie.dto';
import { PreuveVerifie } from '../entities/preuve_verifie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PcAudit } from '../../entities/pc-audit.entity';
import { Preuve } from 'src/normes/chapitres/points-controle/preuves/entities/preuve.entity';

@Injectable()
export class PreuveVerifieService {
  constructor(
    @InjectRepository(PreuveVerifie) private preuveVerifieRepository: Repository<PreuveVerifie>,
    @InjectRepository(PcAudit) private pcAuditRepository: Repository<PcAudit>,
    @InjectRepository(Preuve) private preuveRepository: Repository<Preuve>
  ){}
  //creation du preuve verifieeau debut seulement avec la preuve et le status
  async create(createPreuveVerifieDto: CreatePreuveVerifieDto): Promise<PreuveVerifie> {
    const preuveVerifie = new PreuveVerifie();
    preuveVerifie.pvv = await this.preuveRepository.findOne({where: {id:createPreuveVerifieDto.pv.id}});
    preuveVerifie.status = createPreuveVerifieDto.status;

    return this.preuveVerifieRepository.save(preuveVerifie);
  }

  //associer les preuves verifiees a point de controle traite
  async associateWithPcAudit(pca:PcAudit, preuveVerifieIds: string[]): Promise<void> {
    const pcAudit = await this.pcAuditRepository.findOne({where:{id:pca.id}});
    const preuvesVerifiees = await this.preuveVerifieRepository.findByIds(preuveVerifieIds);

    preuvesVerifiees.forEach(preuveVerifie => {
      preuveVerifie.pca = pcAudit;
    });

    await this.preuveVerifieRepository.save(preuvesVerifiees);
  }

  findAll() {
    return `This action returns all preuveVerifie`;
  }

  findOne(id: number) {
    return `This action returns a #${id} preuveVerifie`;
  }

  update(id: number, updatePreuveVerifieDto: UpdatePreuveVerifieDto) {
    return `This action updates a #${id} preuveVerifie`;
  }

  remove(id: number) {
    return `This action removes a #${id} preuveVerifie`;
  }
}
