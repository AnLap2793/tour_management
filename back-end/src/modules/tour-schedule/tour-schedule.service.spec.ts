import { Test, TestingModule } from '@nestjs/testing';
import { TourScheduleService } from './tour-schedule.service';

describe('TourScheduleService', () => {
  let service: TourScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourScheduleService],
    }).compile();

    service = module.get<TourScheduleService>(TourScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
