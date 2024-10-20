import { CreatePointsControleDto } from "../points-controle/dto/create-points-controle.dto";
import { CreateChapitreDto } from "./create-chapitre.dto";

export class UploadChaptersWithControlPointsDto {
      chapitre: string;
      pointsControle: {
        designation: string;
        objectif: string;
      }[];
  }