import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PointsControle } from "../../entities/points-controle.entity";

@Entity()
export class Preuve {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    designation: string;
    @ManyToOne(()=>PointsControle, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    point_controle: PointsControle

    constructor(preuve: Partial<PointsControle>){
        Object.assign(this, preuve);
    }
}
