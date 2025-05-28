import { Test, TestingModule } from '@nestjs/testing';
import { DepartureLocationService } from './departure-location.service';

describe('DepartureLocationService', () => {
  let service: DepartureLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartureLocationService],
    }).compile();

    service = module.get<DepartureLocationService>(DepartureLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
