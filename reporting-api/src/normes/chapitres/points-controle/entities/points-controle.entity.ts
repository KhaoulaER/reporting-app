import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Chapitre } from "../../entities/chapitre.entity";
import { Preuve } from "../preuves/entities/preuve.entity";
import { PcAudit } from "src/audit/pc-audit/entities/pc-audit.entity";

@Entity()
export class PointsControle {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    designation:string;
    @Column({nullable:true})
    objectif:string
    @ManyToOne(()=>Chapitre, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    chapitre: Chapitre
    @OneToMany(() => Preuve, preuve => preuve.point_controle)
    preuve: Preuve[];
    @OneToMany(() => PcAudit, (pc_audit) => pc_audit.pc)
    pc_audit: PcAudit[];
    constructor(pc: Partial<PointsControle>){
        Object.assign(this, pc);
    }

}
