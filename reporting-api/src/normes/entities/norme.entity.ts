import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Norme {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    designation: string;
    

    constructor(norme: Partial<Norme>){
        Object.assign(this, norme);
      }
}
