import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    nom: string;
    @Column()
    logo: string;
    @Column()
    email: string;
    @Column()
    tel:string;

    constructor(client: Partial<Client>){
        Object.assign(this, client);
      }
}
