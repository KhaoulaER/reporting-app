import { Test, TestingModule } from '@nestjs/testing';
import { NormesService } from './normes.service';

describe('NormesService', () => {
  let service: NormesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NormesService],
    }).compile();

    service = module.get<NormesService>(NormesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
