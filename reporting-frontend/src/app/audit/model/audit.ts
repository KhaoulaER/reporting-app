import { PointsControle, Preuve } from "../../normes/model/norme";
import { NormeAdopte } from "../../projets/model/projet";
import { User } from "../../user/model/user";

export interface Audit{
    id: string,
    norme_projet: NormeAdopte,
    auditeur: User
    date_audit: Date;
}
export interface PcAudit{
    id: string,
    pc: PointsControle,
    niveau_maturite: string,
    constat: string,
    commentaire: string,
    preuves: Preuve[],
    audit: Audit
}
/*export interface PreuveVerifie{
    id: string,
    pca: PcAudit,
    preuve: Preuve,
    status: boolean
}*/