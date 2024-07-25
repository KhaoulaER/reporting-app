import { Test, TestingModule } from '@nestjs/testing';
import { PcAuditService } from './pc-audit.service';

describe('PcAuditService', () => {
  let service: PcAuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PcAuditService],
    }).compile();

    service = module.get<PcAuditService>(PcAuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
