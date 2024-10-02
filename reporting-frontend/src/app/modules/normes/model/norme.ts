import { PcAudit } from "../../audit/model/audit";

export interface Norme{
    id: string,
    designation: string,
    echel: string,
    chapitre: Chapitre[];
}
export interface Chapitre {
    id: string;
    titre: string;
    description: string;
    norme: Norme;
    pointsControle: PointsControle[];
}

export interface PointsControle {
    id: string;
    designation: string;
    objectif: string;
    preuve: Preuve[];
    pc_audits: PcAudit[];
}

export interface Preuve {
    id: string;
    designation: string;
}