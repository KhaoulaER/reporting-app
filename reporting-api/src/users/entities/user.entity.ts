import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum Role{
    AUDITOR='AUDITOR',
    PROJECT_MANAGER='PROJECT MANAGER',
    ADMIN='ADMIN',
}
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    firstName: string;
    @Column()
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
      @Column({ nullable: true })
      photo: string;

      constructor(user: Partial<User>){
        Object.assign(this, user);
      }

}
