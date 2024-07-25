import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PcAudit } from "../../entities/pc-audit.entity";
import { Preuve } from "src/normes/chapitres/points-controle/preuves/entities/preuve.entity";

@Entity()
export class PreuveVerifie {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @ManyToOne(()=>PcAudit)
    @JoinColumn()
    pca: PcAudit;
    @ManyToOne(()=>Preuve, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    pvv: Preuve;
    @Column({default:false})
    status: boolean;
}
