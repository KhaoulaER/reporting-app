import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { KeycloakUserDto } from '../dto/create-user.dto';

import { UpdateUserDto } from '../dto/update-user.dto';
import { EntityManager, In, Repository } from 'typeorm';
import { Role, User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import KeycloakAdminClient from 'keycloak-admin';
import { ConfigService } from '@nestjs/config';
import { AuthenticationErrors } from 'src/iam/_business/authentification.error';
import { Result } from 'src/shared/result/result.model';
import { ConnexionKeycloakService } from 'src/connexion-keycloak.service';

//import { KeycloakService } from 'src/core/auth/keycloak/keycloak/keycloak.service';

@Injectable()
export class UsersService {
  constructor(
  private readonly entityManager:EntityManager,
  @InjectRepository(User) private userRepository: Repository<User>,
  private configService:ConfigService,
  private connexionKeycloakService: ConnexionKeycloakService,
){}
async create(userData: Partial<User>): Promise<User> {
  
  // Étape 1: Ajouter l'utilisateur dans Keycloak
  const keycloakUser = await this.createUserInKeycloak(userData);

  // Étape 2: Assigner l'utilisateur à un groupe dans Keycloak
  await this.assignUserToGroup(keycloakUser.id, 'group-name');

  // Étape 3: Ajouter l'utilisateur dans la base de données
  const user = this.userRepository.create({
    ...userData,
    keycloakId: keycloakUser.id, // Stocker l'ID Keycloak dans la base de données
  });
  
  return this.userRepository.save(user);
}

// Création d'un utilisateur dans Keycloak avec un token en en-tête
private async createUserInKeycloak(userData: Partial<User> & { attributes?: Record<string, string[]>; groups?: string[] }) {
  const adminClient = this.connexionKeycloakService.adminClient;
  //adminClient.setAccessToken(token);

  const newUser = await adminClient.users.create({
    realm: this.configService.get('KEYCLOAK_REALM'),
    username: userData.email,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    enabled: true,
    emailVerified: true, // Mark the email as verified
    credentials: [
      {
        type: 'password',
        value: userData.password,
        temporary: false,
      },
    ],
    attributes: userData.attributes || {},
    groups: userData.groups || [],
  });

  return newUser;
}

// Assigner un utilisateur à un groupe dans Keycloak
private async assignUserToGroup(userId: string, groupName: string): Promise<void> {
  const adminClient = this.connexionKeycloakService.adminClient;
  //adminClient.setAccessToken(token);

  const groups = await adminClient.groups.find({
    realm: this.configService.get('KEYCLOAK_REALM'),
    search: groupName,
  });

  if (groups.length > 0) {
    await adminClient.users.addToGroup({
      id: userId,
      groupId: groups[0].id,
      realm: this.configService.get('KEYCLOAK_REALM'),
    });
  }
}

// Vérification de l'appartenance au groupe ADMIN
private async isUserAdmin(token: string): Promise<boolean> {
  const adminClient = this.connexionKeycloakService.adminClient;
  adminClient.setAccessToken(token);

  // Ici, vous récupérez l'utilisateur courant basé sur le token et vérifiez s'il est dans le groupe ADMIN
  const user = await adminClient.users.findOne({ realm: this.configService.get('KEYCLOAK_REALM'), id: adminClient.accessToken });
  const groups = await adminClient.users.listGroups({ id: user.id });
  
  return groups.some(group => group.name === 'ADMIN');
}


async getUserByToken(token: string) {
  try {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'GET',
    };

    const response = await fetch(
      `${this.configService.get('KEYCLOAK_URL')}/protocol/openid-connect/userinfo`,
      options,
    );

    if (response.status !== 200) {
      return Result.Fail(
        AuthenticationErrors.unauthorizedError('user_login_expired'),
      );
    }

    const userInfo = await response.json();

    // Ajout manuel des rôles pour le test
    userInfo.roles = ['AUDITOR', 'ADMIN'];

    return Result.OK(userInfo);
  } catch (error) {
    return Result.Fail(error);
  }
}

async findUsersByGroup(groupName: string): Promise<User[]> {
  const adminClient = this.connexionKeycloakService.adminClient;
  const realm = this.configService.get('KEYCLOAK_REALM');
  
  // Step 1: Get the group from Keycloak
  const groups = await adminClient.groups.find({ realm, search: groupName });
  
  if (groups.length === 0) {
    return [];
  }

  const groupId = groups[0].id;

  // Step 2: Get users in the group from Keycloak
  const keycloakUsers = await adminClient.groups.listMembers({
    id: groupId,
    realm,
  });

  // Step 3: Get the Keycloak IDs of these users
  const keycloakIds = keycloakUsers.map(user => user.id);

  // Step 4: Find matching users in the local database by Keycloak ID
  return this.userRepository.find({
    where: { keycloakId: In(keycloakIds) },
  });
}

  findAll() {
    return `This action returns all users`;
  }

  async findAllByRole(group: string): Promise<User[]>{
    return this.userRepository.find({where: {}});
  }

  async findOne(email:string) {
    return this.userRepository.findOneBy({email});
  }

  ///////////////////////// UPDATE USERS /////////////
  private async updateUserInKeycloak(userData: Partial<User> & { attributes?: Record<string, string[]>; groups?: string[] }) {
    const adminClient = this.connexionKeycloakService.adminClient;
    //adminClient.setAccessToken(token);
    const users = await adminClient.users.find({
      realm: this.configService.get('KEYCLOAK_REALM'),
      username: userData.email,
  });

  if (users.length === 0) {
      throw new Error('User not found in Keycloak');
  }

  const userId = users[0].id;

  // Prepare the payload with the updated user information
  const payload = {
      username: userData.email,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      enabled: true,
      attributes: userData.attributes || {},
      //groups: userData.groups || [],
  };

  // Update the user in Keycloak
  await adminClient.users.update({
      realm: this.configService.get('KEYCLOAK_REALM'),
      id: userId,
  }, payload);

  return users[0];
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    
    if (!user) {
        throw new Error('User not found');
    }

    // Update the user's information in your local database
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.email = updateUserDto.email;
    // Update other fields as needed
    // user.role = updateUserDto.role;

    // Save the updated user to the database
    await this.entityManager.save(user);

    // Prepare the data to update the user in Keycloak
    const keycloakUserData = {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        email: updateUserDto.email,
        //attributes: updateUserDto.attributes || {}, // Include any additional attributes if present
        //groups: updateUserDto.groups || [], // Include any groups if needed
    };

    // Update the user in Keycloak
    await this.updateUserInKeycloak(keycloakUserData);
  }

  async remove(id: string) {
    // Find the user in your local database
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    // Remove the user from Keycloak
    await this.removeUserInKeycloak({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        //attributes: user.attributes,
        //groups: user.groups,
    });

    // Remove the user from your local database
    return this.userRepository.delete(id);
}

// Ensure that this removeUserInKeycloak method is defined in the same class
private async removeUserInKeycloak(userData: Partial<User> & { attributes?: Record<string, string[]>; groups?: string[] }) {
    const adminClient = this.connexionKeycloakService.adminClient;

    // Find the user in Keycloak by their username or email
    const users = await adminClient.users.find({
        realm: this.configService.get('KEYCLOAK_REALM'),
        username: userData.email,
    });

    if (users.length === 0) {
        throw new Error('User not found in Keycloak');
    }

    const userId = users[0].id;

    // Remove the user from Keycloak
    await adminClient.users.del({
        realm: this.configService.get('KEYCLOAK_REALM'),
        id: userId,
    });

    return { message: 'User successfully removed from Keycloak', userId };
}


}
