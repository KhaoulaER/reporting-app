import { Test, TestingModule } from '@nestjs/testing';
import { PreuveVerifieController } from './preuve_verifie.controller';
import { PreuveVerifieService } from './preuve_verifie.service';

describe('PreuveVerifieController', () => {
  let controller: PreuveVerifieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreuveVerifieController],
      providers: [PreuveVerifieService],
    }).compile();

    controller = module.get<PreuveVerifieController>(PreuveVerifieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
