import { NormeAdopte } from "src/projets/norme-adopte/entities/norme-adopte.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PcAudit } from "../pc-audit/entities/pc-audit.entity";

@Entity()
export class Audit {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    date_audit: Date
    @Column({default: false})
    control: boolean
    @Column({default: false})
    downloaded: boolean
    @ManyToOne(()=>User, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    auditeur: User;
    @ManyToOne(()=>NormeAdopte, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    norme_projet: NormeAdopte;
    @OneToMany(() => PcAudit, (pc_audit) => pc_audit.audit)
    pc_audit: PcAudit[];

    constructor(pc: Partial<Audit>){
        Object.assign(this, pc);
    }
}
