import { Test, TestingModule } from '@nestjs/testing';
import { NormeAdopteController } from './norme-adopte.controller';
import { NormeAdopteService } from './norme-adopte.service';

describe('NormeAdopteController', () => {
  let controller: NormeAdopteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NormeAdopteController],
      providers: [NormeAdopteService],
    }).compile();

    controller = module.get<NormeAdopteController>(NormeAdopteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
