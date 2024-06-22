import { Test, TestingModule } from '@nestjs/testing';
import { PointsControleService } from './points-controle.service';

describe('PointsControleService', () => {
  let service: PointsControleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointsControleService],
    }).compile();

    service = module.get<PointsControleService>(PointsControleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
