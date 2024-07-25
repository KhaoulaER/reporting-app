import { Client } from "src/clients/entities/client.entity";
import { User } from "src/users/entities/user.entity";
import { NormeAdopte } from "../norme-adopte/entities/norme-adopte.entity";

export class CreateProjetDto {
    readonly designation: string;
    readonly date: Date;
    readonly normeIds:string[]
    readonly client: Client;
    //readonly project_manager: User;
}
