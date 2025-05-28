import { Test, TestingModule } from '@nestjs/testing';
import { TourImageController } from './tour-image.controller';
import { TourImageService } from './tour-image.service';

describe('TourImageController', () => {
  let controller: TourImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TourImageController],
      providers: [TourImageService],
    }).compile();

    controller = module.get<TourImageController>(TourImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
