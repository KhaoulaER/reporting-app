import { Test, TestingModule } from '@nestjs/testing';
import { ChapitresService } from './chapitres.service';

describe('ChapitresService', () => {
  let service: ChapitresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChapitresService],
    }).compile();

    service = module.get<ChapitresService>(ChapitresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
