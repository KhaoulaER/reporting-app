import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chapitre } from "../../entities/chapitre.entity";

@Entity()
export class PointsControle {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    designation:string;
    @Column()
    objectif:string
    @ManyToOne(()=>Chapitre, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    chapitre: Chapitre
    constructor(pc: Partial<PointsControle>){
        Object.assign(this, pc);
    }

}
