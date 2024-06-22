import { Test, TestingModule } from '@nestjs/testing';
import { PreuvesController } from './preuves.controller';
import { PreuvesService } from './preuves.service';

describe('PreuvesController', () => {
  let controller: PreuvesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreuvesController],
      providers: [PreuvesService],
    }).compile();

    controller = module.get<PreuvesController>(PreuvesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
