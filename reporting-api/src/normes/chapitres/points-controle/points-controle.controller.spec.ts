import { Test, TestingModule } from '@nestjs/testing';
import { PointsControleController } from './points-controle.controller';
import { PointsControleService } from './points-controle.service';

describe('PointsControleController', () => {
  let controller: PointsControleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointsControleController],
      providers: [PointsControleService],
    }).compile();

    controller = module.get<PointsControleController>(PointsControleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
