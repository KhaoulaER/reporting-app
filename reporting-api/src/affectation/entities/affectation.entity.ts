import { Projet } from "src/projets/entities/projet.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Affectation {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    date_affectation: Date;
    @Column({default: ''})
    droit: string;
    @ManyToOne(()=>User, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    auditeur: User;
    @ManyToOne(()=>Projet, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    projet: Projet;
    constructor(affectation: Partial<Affectation>){
        Object.assign(this, affectation);
    }
}
