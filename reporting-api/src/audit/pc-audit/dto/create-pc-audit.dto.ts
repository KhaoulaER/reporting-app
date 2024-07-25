import { Audit } from "src/audit/entities/audit.entity";
import { PointsControle } from "src/normes/chapitres/points-controle/entities/points-controle.entity";
import { Preuve } from "src/normes/chapitres/points-controle/preuves/entities/preuve.entity";

export class CreatePcAuditDto {
    readonly pc: PointsControle
    readonly niveau_maturite: string
    readonly constat: string
    readonly audit: Audit
    readonly commentaire:string
    //readonly preuvesVerifies: Preuve[];
}
