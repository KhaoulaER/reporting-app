import { NormeAdopte } from "src/projets/norme-adopte/entities/norme-adopte.entity"
import { User } from "src/users/entities/user.entity"

export class CreateAuditDto {
    readonly date_audit: string 
    readonly auditeur: User
    readonly norme_projet: NormeAdopte
}
