import { Test, TestingModule } from '@nestjs/testing';
import { TourScheduleController } from './tour-schedule.controller';
import { TourScheduleService } from './tour-schedule.service';

describe('TourScheduleController', () => {
  let controller: TourScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TourScheduleController],
      providers: [TourScheduleService],
    }).compile();

    controller = module.get<TourScheduleController>(TourScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
