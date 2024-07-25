import { Preuve } from "src/normes/chapitres/points-controle/preuves/entities/preuve.entity";
import { PcAudit } from "../../entities/pc-audit.entity";

export class CreatePreuveVerifieDto {
    readonly pca: PcAudit;
    readonly pv: Preuve;
    readonly status: boolean;
}
