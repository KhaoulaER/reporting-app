import { Test, TestingModule } from '@nestjs/testing';
import { NormesController } from './normes.controller';
import { NormesService } from './normes.service';

describe('NormesController', () => {
  let controller: NormesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NormesController],
      providers: [NormesService],
    }).compile();

    controller = module.get<NormesController>(NormesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
