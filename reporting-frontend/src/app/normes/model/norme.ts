export interface Norme{
    id: string,
    designation: string,
}
export interface Chapitre{
    id: string,
    titre: string,
    description: string,
    norme: Norme,
}
export interface PointsControle{
    id: string,
    designation: string,
    objectif: string,
    chapitre:Chapitre
}
export interface Preuve{
    id: string,
    designation: string,
    point_controle: PointsControle
}