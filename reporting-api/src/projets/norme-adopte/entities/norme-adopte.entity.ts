import { Norme } from "src/normes/entities/norme.entity";
import { Projet } from "src/projets/entities/projet.entity";
import { Column, Double, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NormeAdopte {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(()=>Norme, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    norme: Norme;
    @ManyToOne(() => Projet, (projet) => projet.normeAdopte)
    projet: Projet;
    @Column({ default: 0 })
    evaluation: number;
    @Column({default: false})
    validation: boolean
    
}
