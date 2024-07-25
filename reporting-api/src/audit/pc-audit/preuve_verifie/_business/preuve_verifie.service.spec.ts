import { Test, TestingModule } from '@nestjs/testing';
import { PreuveVerifieService } from './preuve_verifie.service';

describe('PreuveVerifieService', () => {
  let service: PreuveVerifieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreuveVerifieService],
    }).compile();

    service = module.get<PreuveVerifieService>(PreuveVerifieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
