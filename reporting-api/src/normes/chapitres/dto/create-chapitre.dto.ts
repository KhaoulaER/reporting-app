import { CreateNormeDto } from "src/normes/dto/create-norme.dto";
import { Norme } from "src/normes/entities/norme.entity";

export class CreateChapitreDto {
    readonly titre:string;
    readonly description:string;
}
