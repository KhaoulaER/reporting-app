import { Norme } from "src/normes/entities/norme.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PointsControle } from "../points-controle/entities/points-controle.entity";

@Entity()
export class Chapitre {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column({nullable: true })    
    titre:string
    @Column({default:null})
    description:string
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;
    @ManyToOne(()=> Norme, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    norme: Norme

    @OneToMany(() => PointsControle, pointsControle => pointsControle.chapitre)
    pointsControle: PointsControle[];
    
    constructor(){
    }
}
