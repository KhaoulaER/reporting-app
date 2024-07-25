import { Test, TestingModule } from '@nestjs/testing';
import { NormeAdopteService } from './norme-adopte.service';

describe('NormeAdopteService', () => {
  let service: NormeAdopteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NormeAdopteService],
    }).compile();

    service = module.get<NormeAdopteService>(NormeAdopteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
