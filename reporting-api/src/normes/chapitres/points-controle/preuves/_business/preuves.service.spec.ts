import { Test, TestingModule } from '@nestjs/testing';
import { PreuvesService } from './preuves.service';

describe('PreuvesService', () => {
  let service: PreuvesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreuvesService],
    }).compile();

    service = module.get<PreuvesService>(PreuvesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
