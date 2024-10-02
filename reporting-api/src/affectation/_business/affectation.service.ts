import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAffectationDto } from '../dto/create-affectation.dto'; 
import { UpdateAffectationDto } from '../dto/update-affectation.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Affectation } from '../entities/affectation.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Projet } from 'src/projets/entities/projet.entity';
import { ConnexionKeycloakService } from 'src/connexion-keycloak.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AffectationService {
  constructor(
    @InjectRepository(Affectation) private affectationRepository:Repository<Affectation>,
    @InjectRepository(User) private userRepository:Repository<User>,
    @InjectRepository(Projet) private projetRepository:Repository<Projet>,
    private readonly entityManager: EntityManager,
    private readonly keycloakService: ConnexionKeycloakService,
    private configService:ConfigService,
  ){}

    async create(auditeurId: string, projetId: string, createAffectationDto: CreateAffectationDto): Promise<Affectation> {
      const auditeur = await this.userRepository.findOneBy({ keycloakId: auditeurId } );
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
      console.log('affectation dto service: ',createAffectationDto.droit)
      // Assign role to the auditor in Keycloak based on `droit` (permissions)
    const role = createAffectationDto.droit === 'read-write' ? 'read-write' : 'read-only';
    
    // Call the function to assign the role in Keycloak
    await this.assignRoleToAuditor(auditeur.keycloakId, projet.id, role);
      return this.affectationRepository.save(affectation);
    }


///////////////////////////// ASSIGN ROLE TOO AUDITOR /////////////////////////////
async assignRoleToAuditor(userId: string, projectId: string, role: 'read-only' | 'read-write') {
  try {
    const keycloakAdmin = await this.keycloakService.adminClient;
    //console.log('Keycloak Admin Client:', keycloakAdmin);

    console.log(`Assigning role to user with ID: ${userId}, Project ID: ${projectId}, Role: ${role}`);

    // Fetch the auditor group ID
    const groupId = await this.getAuditorGroupId(keycloakAdmin);
    console.log('Auditor group ID:', groupId);

    
      await this.keycloakService.assignRoleToAuditor(userId, projectId, role);
    
  } catch (error) {
    console.error('Error assigning role to user:', error.message);
    throw new Error('Could not assign role to user');
  }
}


// New method to update a user's role from read-only to read-write, or vice versa
async updateUserRole(auditeurId: string, projetId: string, newRole: 'read-only' | 'read-write'): Promise<void> {
  // Find the user
  const auditeur = await this.userRepository.findOneBy({ keycloakId: auditeurId });
  if (!auditeur) {
    throw new NotFoundException('Auditeur not found');
  }

  // Find the project
  const projet = await this.projetRepository.findOne({ where: { id: projetId } });
  if (!projet) {
    throw new NotFoundException('Projet not found');
  }

  // Logic to change role
  try {
    // First, check if the user already has a role assigned for this project
    const currentRole = await this.keycloakService.getUserRoleForProject(auditeur.keycloakId, projetId);

    if (!currentRole) {
      throw new Error('No current role assigned for this user in this project');
    }

    console.log(`Current role for user ${auditeurId} in project ${projetId}: ${currentRole}`);

    // Check if the current role needs to be updated
    if (currentRole === newRole) {
      console.log(`User already has the role ${newRole}, no update needed.`);
      return;
    }

    // Update the role by removing the old one and assigning the new one
    await this.keycloakService.removeRoleFromUser(auditeur.keycloakId, projetId, currentRole);
    await this.keycloakService.assignRoleToAuditor(auditeur.keycloakId, projetId, newRole);

    console.log(`Successfully updated role from ${currentRole} to ${newRole} for user ${auditeurId} in project ${projetId}`);
  } catch (error) {
    console.error('Error updating role:', error.message);
    throw new Error('Could not update user role');
  }
}


private async getAuditorGroupId(keycloakAdmin:any): Promise<string> {
  //const keycloakAdmin = await this.keycloakService.adminClient;
  
  const realm = this.configService.get('KEYCLOAK_REALM');
  const groups = await keycloakAdmin.groups.find({realm});

  //console.log('Fetched groups:', groups); // Log all groups

  const auditorGroup = groups.find(group => group.name === 'AUDITOR');
  //console.log('GROUP: ', auditorGroup)
  //console.log('GROUP ID: ', auditorGroup.id)
 
if (auditorGroup) {
    return auditorGroup.id;
  } else {
    throw new Error('Auditor group not found');
  }
}
  //les affectation par auditeur
  async findByAuditeur(auditeurId: string): Promise<any[]> {
   /* return this.affectationRepository.createQueryBuilder('affectation')
        .leftJoinAndSelect('affectation.auditeur', 'auditeur')
        .leftJoinAndSelect('affectation.projet', 'projet')
        .leftJoinAndSelect('projet.normeAdopte', 'normeAdopte')
        .leftJoinAndSelect('normeAdopte.norme','norme')
        .where('affectation.auditeur.keycloakId = :auditeurId', { auditeurId })
        .getMany();*/
    return await this.affectationRepository.find({where: {auditeur:{keycloakId:auditeurId}},
      relations: ['auditeur','projet','projet.normeAdopte','projet.normeAdopte.norme']
    })

}


  async findDroit(affectationId:string): Promise<string>{
    const affectation = this.affectationRepository.findOne({where: {id:affectationId}});
    return (await affectation).droit;
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

  async update(affectationId: string, updateAffectationDto: UpdateAffectationDto){
    // Fetch the affectation along with its relations
    const affectation = await this.affectationRepository.findOne({
      where: { id: affectationId },
      relations: ['auditeur', 'projet']  // Ensure auditeur and projet are fetched as well
    });
  
    if (!affectation) {
      throw new NotFoundException('Affectation not found');
    }
  
    const { auditeur, projet } = affectation;
  
    // Update the role for the auditor in Keycloak
    const role = updateAffectationDto.droit === 'read-write' ? 'read-write' : 'read-only';
    await this.updateUserRole(auditeur.keycloakId, projet.id, role);
  
    // Update the affectation with new data
    await this.affectationRepository.update(
      { id: affectationId },  // Criteria to find the affectation
      { ...updateAffectationDto }  // Fields to update
    );
  
    // Return the updated affectation
    return this.affectationRepository.findOne({
      where: { id: affectationId },
      relations: ['auditeur', 'projet']
    });
  }

  async remove(id: string) {
    const affectation = await this.affectationRepository.findOne({
      where: { id: id },
      relations: ['auditeur','projet']  // Ensure auditeur and projet are fetched as well
    });
    const {auditeur,projet} = affectation;
    const currentRole = await this.keycloakService.getUserRoleForProject(auditeur.keycloakId, projet.id);

    await this.keycloakService.removeRoleFromUser(auditeur.keycloakId, projet.id, currentRole);
    return this.affectationRepository.delete(id);
  }

  //Count total affectation 
  async countAffectations(auditeurId:string): Promise<number>{
    return await this.affectationRepository
    .createQueryBuilder('affectation')
    .leftJoin('affectation.auditeur', 'user')
    .where('user.keycloakId = :auditeurId', { auditeurId })
    .getCount()
  }

  // count non validated affected projects
  async countNotValidatedAffectations(auditeurId:string): Promise<number>{
    return await this.affectationRepository
    .createQueryBuilder('affectation')
    .leftJoin('affectation.auditeur', 'user')
    .leftJoin('affectation.projet','projet')
    .leftJoin('projet.normeAdopte','normeAdopte')
    .where('user.keycloakId = :auditeurId', { auditeurId })
    .andWhere('normeAdopte.validation = :validation',{validation: false})
    .getCount()
  }
}
