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
import { ConnexionKeycloakService } from 'src/connexion-keycloak.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class ProjetsService {
  constructor(
    @InjectRepository(Projet) private projetRepository:Repository<Projet>,
    @InjectRepository(Client) private clientRepository:Repository<Client>,
    @InjectRepository(User) private userRepository:Repository<User>,
    @InjectRepository(Norme) private normeRepository:Repository<Norme>,
    //@InjectRepository(Affectation) private affectationRepository:Repository<Affectation>,
    @InjectRepository(NormeAdopte) private normeAdopteRepository:Repository<NormeAdopte>,
    private readonly entityManager: EntityManager,
    private readonly keycloakService: ConnexionKeycloakService,
    private configService:ConfigService,

  ){}


  /*async create(projectManagerId: string, createProjetDto: CreateProjetDto): Promise<Projet> {
    const { designation, client, normeIds } = createProjetDto;
    const projectManager = await this.userRepository.findOneBy({ keycloakId: projectManagerId });
    const normes = await this.normeRepository.findByIds(normeIds);
  
    const projet = this.projetRepository.create({ designation, client, project_manager: projectManager });
    const savedProjet = await this.projetRepository.save(projet);
  
    // Save associated adopted norms (normeAdoptees)
    const normeAdoptees = normes.map(norme => {
      const normeAdopte = new NormeAdopte();
      normeAdopte.norme = norme;
      normeAdopte.projet = savedProjet;
      return this.normeAdopteRepository.save(normeAdopte);
    });
    await Promise.all(normeAdoptees);
  
    // Create project roles in Keycloak
    await this.createAndAssignRolesInKeycloak(savedProjet.id, projectManager.keycloakId);
  
    // Assign the 'read-write' role to the project manager in the database
    //await this.assignRoleToUserInDatabase(savedProjet.id, projectManager.id, 'read-write');
  
    return savedProjet;
  }




  private async createAndAssignRolesInKeycloak(projectId: string, projectManagerKeycloakId: string): Promise<void> {
    const keycloakAdmin = await this.keycloakService.adminClient;
    const clientId = this.configService.get('KEYCLOAK_CLIENT_ID'); // Client ID for 'grc-client'
    const realm = this.configService.get('KEYCLOAK_REALM');
  
    // Create read-only role
    const readOnlyRole = await keycloakAdmin.roles.create({
      name: `project-${projectId}-read-only`,
      clientRole: true,
      realm,
    });
  
    // Create read-write role
    const readWriteRole = await keycloakAdmin.roles.create({
      name: `project-${projectId}-read-write`,
      clientRole: true,
      realm,
    });
    // Assign the 'read-write' role to the project manager in Keycloak
    const userRoles = await keycloakAdmin.users.listRealmRoleMappings({
      id: projectManagerKeycloakId,
      realm,
    });
    
    //await this.keycloakService.assignRoleToAuditor(projectManagerKeycloakId, projectId, readWriteRole);

    await keycloakAdmin.users.addRealmRoleMappings({
      id: projectManagerKeycloakId,
      realm,
      roles: [{ id: readWriteRole.roleName, name: readWriteRole.roleName }],
    });
  }*/

  async create(projectManagerId:string,createProjetDto: CreateProjetDto): Promise<Projet> {
    const { designation, client, normeIds } = createProjetDto;
    //console.log('pm id: ',projectManagerId)
    //const client = await this.clientRepository.findOneBy({ id: clientId });
    const projectManager = await this.userRepository.findOneBy({ keycloakId: projectManagerId });
    //console.log('pro manager seerv: ', projectManager);
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
    // Create roles in Keycloak
    await this.createAndAssignRolesInKeycloak(savedProjet.id);

    return savedProjet;
  }

  // CREATE PROJECT ROLES IN KEYCLOAK
  private async createAndAssignRolesInKeycloak(projectId: string): Promise<void> {
    const keycloakAdmin = await this.keycloakService.adminClient;
    const clientId = this.configService.get('KEYCLOAK_CLIENT_ID'); // Client ID for 'grc-client'
    const realm = this.configService.get('KEYCLOAK_REALM');
    
    // Create read-only role
    const readOnlyRole = await keycloakAdmin.roles.create({
        name: `project-${projectId}-read-only`,
        clientRole: true,
        realm
    });

    // Create read-write role
    const readWriteRole = await keycloakAdmin.roles.create({
        name: `project-${projectId}-read-write`,
        clientRole: true,
        realm,
    });

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
      where: { project_manager: { keycloakId: managerId } },
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

  // CREATE PROJECT ROLES IN KEYCLOAK
  private async removeRolesInKeycloak(projectId: string): Promise<void> {
    const keycloakAdmin = await this.keycloakService.adminClient;
    const clientId = this.configService.get('KEYCLOAK_CLIENT_ID'); // Client ID for 'grc-client'
    const realm = this.configService.get('KEYCLOAK_REALM');
    
    // Create read-only role
    const readOnlyRole = await keycloakAdmin.roles.delByName({
        name: `project-${projectId}-read-only`,
        //clientRole: true,
        realm
    });

    // Create read-write role
    const readWriteRole = await keycloakAdmin.roles.delByName({
        name: `project-${projectId}-read-write`,
        //clientRole: true,
        realm,
    });

    // Search for the AUDITOR group
    const auditorGroup = await keycloakAdmin.groups.find({
        realm,
        search: 'AUDITOR' // Ensure that this matches the correct group name
    });
  }

  remove(id: string) {
    this.removeRolesInKeycloak(id);
    return this.projetRepository.delete(id);
  }

  // count all projects
  async countProjects(managerId:string): Promise<number>{
    return await this.projetRepository
    .createQueryBuilder('projet')
    .leftJoin('projet.project_manager', 'user')
    .where('user.keycloakId = :managerId', { managerId })
    .getCount()
  }

  //Number of unvalidated projects
  async countProjectsNotValidatedByManager(managerId: string): Promise<number> {
    return await this.projetRepository
    .createQueryBuilder('projet')
    .leftJoin('projet.normeAdopte', 'normeAdopte')
    .leftJoin('projet.project_manager', 'user')
    .where('user.keycloakId = :managerId', { managerId })
    .andWhere('normeAdopte.validation = :validation', { validation: false })
    .getCount();
}

// not validated projects
async findProjectsNotValidated(managerId:string): Promise<any[]>{
  return await this.projetRepository
  .createQueryBuilder('projet')
    .leftJoinAndSelect('projet.normeAdopte', 'normeAdopte')
    .leftJoinAndSelect('normeAdopte.norme', 'norme')  // If you need the `norme` relation
    .leftJoin('projet.project_manager', 'user')
    .where('user.keycloakId = :managerId', { managerId })
    .andWhere('normeAdopte.validation = :validation', { validation: false })  // Ensure `validation` is boolean
    .getMany();
}

}
