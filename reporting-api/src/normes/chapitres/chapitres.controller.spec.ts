import { Test, TestingModule } from '@nestjs/testing';
import { ChapitresController } from './chapitres.controller';
import { ChapitresService } from './chapitres.service';

describe('ChapitresController', () => {
  let controller: ChapitresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChapitresController],
      providers: [ChapitresService],
    }).compile();

    controller = module.get<ChapitresController>(ChapitresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
