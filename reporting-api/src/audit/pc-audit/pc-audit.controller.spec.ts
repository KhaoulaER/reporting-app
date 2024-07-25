import { Test, TestingModule } from '@nestjs/testing';
import { PcAuditController } from './pc-audit.controller';
import { PcAuditService } from './_business/pc-audit.service'; 

describe('PcAuditController', () => {
  let controller: PcAuditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PcAuditController],
      providers: [PcAuditService],
    }).compile();

    controller = module.get<PcAuditController>(PcAuditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
