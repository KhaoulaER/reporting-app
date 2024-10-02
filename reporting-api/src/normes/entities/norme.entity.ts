import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chapitre } from "../chapitres/entities/chapitre.entity";

@Entity()
export class Norme {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    designation: string;
    @Column({default:''})
    echel: string;
    @OneToMany(() => Chapitre, chapitre => chapitre.norme)
    chapitre: Chapitre[];

    constructor(norme: Partial<Norme>){
        Object.assign(this, norme);
      }
}
