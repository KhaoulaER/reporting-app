import { PointsControle } from "../../entities/points-controle.entity"

export class CreatePreuveDto {
    readonly id:string
    readonly designation:string
    point_controle: PointsControle
}
