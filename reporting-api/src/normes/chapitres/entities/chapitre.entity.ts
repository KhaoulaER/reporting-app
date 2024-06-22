import { Norme } from "src/normes/entities/norme.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chapitre {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    titre:string
    @Column()
    description:string
    @ManyToOne(()=> Norme, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    norme: Norme
    constructor(chapitre: Partial<Chapitre>){
        Object.assign(this, chapitre);
    }
}
