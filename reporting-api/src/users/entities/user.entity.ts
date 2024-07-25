import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum Role{
    AUDITOR='AUDITOR',
    PROJECT_MANAGER='PROJECT_MANAGER',
    ADMIN='ADMIN',
}
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;
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
    @Column({
        type: 'enum',
        enum: Role,
      })
      role: Role;
      

      constructor(user: Partial<User>){
        Object.assign(this, user);
      }

}
