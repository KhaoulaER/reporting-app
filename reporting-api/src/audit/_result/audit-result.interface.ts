import { NormeAdopte } from "src/projets/norme-adopte/entities/norme-adopte.entity";
import { PcAudit } from "../pc-audit/entities/pc-audit.entity";

export interface AuditResult {
    nms: NormeAdopte[];
    latestEvaluations: PcAudit[];
  }