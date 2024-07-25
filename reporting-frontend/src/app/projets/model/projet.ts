import { Client } from "../../clients/model/clients";
import { Norme } from "../../normes/model/norme";
import { User } from "../../user/model/user";

export interface Projet{
    id:string,
    designation: string,
    date: Date,
    client: Client,
    manager: User,
    normeAdopte: NormeAdopte[];
}
export interface NormeAdopte {
    id: string;
    norme: Norme;
    projet: Projet;
    evaluation: number;
    validation: boolean;
  }

export interface Affectation{
    id: string;
    auditeur: User;
    projet: Projet;
    date_affectation: Date;
    
}