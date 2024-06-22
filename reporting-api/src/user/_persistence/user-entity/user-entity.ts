import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Role{
    AUDITOR='AUDITOR',
    PROJECT_MANAGER='PROJECT MANAGER',
    ADMIN='ADMIN',
}

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id:string;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column()
    email: string;
    @Column()
    phone: string;
    @Column({
        type: 'enum',
        enum: Role,
      })
      role: Role;


}
