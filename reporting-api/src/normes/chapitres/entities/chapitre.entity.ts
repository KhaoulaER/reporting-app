import { Norme } from "src/normes/entities/norme.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PointsControle } from "../points-controle/entities/points-controle.entity";

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

    @OneToMany(() => PointsControle, pointsControle => pointsControle.chapitre)
    pointsControle: PointsControle[];
    
    constructor(chapitre: Partial<Chapitre>){
        Object.assign(this, chapitre);
    }
}
