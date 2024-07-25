import { Audit } from "src/audit/entities/audit.entity";
import { PointsControle } from "src/normes/chapitres/points-controle/entities/points-controle.entity";
import { PointsControleModule } from "src/normes/chapitres/points-controle/points-controle.module";
import { Preuve } from "src/normes/chapitres/points-controle/preuves/entities/preuve.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PcAudit {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(()=>PointsControle, {cascade: true, onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    pc: PointsControle;
    @Column({nullable: true})
    niveau_maturite: string;
    @Column({nullable:true})
    constat: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
    @Column({nullable:true})
    commentaire: string;
    @ManyToOne(() => Audit, {cascade: true, onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    audit: Audit;
   /* @ManyToMany(() => Preuve, { cascade: true })
    @JoinTable()
    preuvesVerifies: Preuve[];*/
}
