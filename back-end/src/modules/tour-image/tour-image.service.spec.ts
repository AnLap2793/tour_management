import { Test, TestingModule } from '@nestjs/testing';
import { TourImageService } from './tour-image.service';

describe('TourImageService', () => {
  let service: TourImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourImageService],
    }).compile();

    service = module.get<TourImageService>(TourImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
