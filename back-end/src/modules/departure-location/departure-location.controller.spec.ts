import { Test, TestingModule } from '@nestjs/testing';
import { DepartureLocationController } from './departure-location.controller';
import { DepartureLocationService } from './departure-location.service';

describe('DepartureLocationController', () => {
  let controller: DepartureLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartureLocationController],
      providers: [DepartureLocationService],
    }).compile();

    controller = module.get<DepartureLocationController>(DepartureLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
