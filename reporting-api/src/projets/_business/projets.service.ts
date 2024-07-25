import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjetDto } from '../dto/create-projet.dto'; 
import { UpdateProjetDto } from '../dto/update-projet.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Projet } from '../entities/projet.entity';
import { EntityManager, Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/users/entities/user.entity';
import { Affectation } from 'src/affectation/entities/affectation.entity';
import { AffectationService } from 'src/affectation/_business/affectation.service';
import { NormeAdopte } from '../norme-adopte/entities/norme-adopte.entity';
import { Norme } from 'src/normes/entities/norme.entity';

@Injectable()
export class ProjetsService {
  constructor(
    @InjectRepository(Projet) private projetRepository:Repository<Projet>,
    @InjectRepository(Client) private clientRepository:Repository<Client>,
    @InjectRepository(User) private userRepository:Repository<User>,
    @InjectRepository(Norme) private normeRepository:Repository<Norme>,
    @InjectRepository(NormeAdopte) private normeAdopteRepository:Repository<NormeAdopte>,
    private readonly entityManager: EntityManager
  ){}

  async create(projectManagerId:string,createProjetDto: CreateProjetDto): Promise<Projet> {
    const { designation, client, normeIds } = createProjetDto;

    //const client = await this.clientRepository.findOneBy({ id: clientId });
    const projectManager = await this.userRepository.findOneBy({ id: projectManagerId });
    const normes = await this.normeRepository.findByIds(normeIds);

    const projet = this.projetRepository.create({ designation, client, project_manager: projectManager });

    const savedProjet = await this.projetRepository.save(projet);

    const normeAdoptees = normes.map(norme => {
      const normeAdopte = new NormeAdopte();
      normeAdopte.norme = norme;
      normeAdopte.projet = savedProjet;
      return this.normeAdopteRepository.save(normeAdopte);
    });

    await Promise.all(normeAdoptees);

    return savedProjet;
  }

  async findByAffectation(auditeurId:string): Promise<Projet[]>{
      /*return await this.projetRepository.query(
      'SELECT * FROM "projet" p JOIN "affectation" a ON p.id = a."projetId" WHERE a."auditeurId" = $1',
      [auditeurId]      );*/
      return await this.projetRepository.find({where:{}})
  }

  async findByManager(managerId:string): Promise<Projet[]>{
    //return await this.projetRepository.find({where:{ project_manager: {id:managerId}}})
    return await this.projetRepository.find({
      where: { project_manager: { id: managerId } },
      relations: ['project_manager', 'client']
    });
  }
  
  findAll() {
    return this.projetRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} projet`;
  }

  update(id: number, updateProjetDto: UpdateProjetDto) {
    return `This action updates a #${id} projet`;
  }

  remove(id: number) {
    return `This action removes a #${id} projet`;
  }
}
