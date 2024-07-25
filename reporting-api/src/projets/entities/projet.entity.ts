import { Client } from "src/clients/entities/client.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NormeAdopte } from "../norme-adopte/entities/norme-adopte.entity";
import { Affectation } from "src/affectation/entities/affectation.entity";

@Entity()
export class Projet {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    designation: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    date: Date;
    @ManyToOne(()=>Client, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    client: Client;
    @ManyToOne(()=>User, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    project_manager: User;
    @OneToMany(() => Affectation, (affectation) => affectation.projet)
    affectations: Affectation[];
    @OneToMany(() => NormeAdopte, (normeAdopte) => normeAdopte.projet)
    normeAdopte: NormeAdopte[];
    constructor(projet: Partial<Projet>){
        Object.assign(this, projet);
    }
}
