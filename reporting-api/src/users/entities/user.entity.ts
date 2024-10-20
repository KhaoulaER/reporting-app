import { Audit } from "src/audit/entities/audit.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


export enum Role{
    AUDITOR='AUDITOR',
    PROJECT_MANAGER='PROJECT_MANAGER',
    ADMIN='ADMIN',
}
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column({ type: 'uuid', unique: true, nullable:true })
    keycloakId: string;  // Stocker l'ID Keycloak
    @Column({ default: '' })
    firstName: string;
    @Column({ default: '' })
    lastName: string;
    @Column()
    email: string;
    @Column()
    password: string
    @Column()
    phone: string;
    @OneToMany(()=>Audit, (audits)=>audits.norme_projet)
    audits:Audit[];


      constructor(user: Partial<User>){
        Object.assign(this, user);
      }

}
