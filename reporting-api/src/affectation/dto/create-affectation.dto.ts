import { Projet } from "src/projets/entities/projet.entity";
import { User } from "src/users/entities/user.entity";

export class CreateAffectationDto {
    readonly date:Date;
    readonly auditeur:User;
    readonly projet:Projet;
}
