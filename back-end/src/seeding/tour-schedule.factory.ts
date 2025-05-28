import { setSeederFactory } from 'typeorm-extension';
import { TourSchedule } from '../entities/tour-schedule.entity';
import { faker } from '@faker-js/faker';
import { TourScheduleStatus } from '../entities/tour-schedule.entity';

export const TourScheduleFactory = setSeederFactory(TourSchedule, () => {
  const tourSchedule = new TourSchedule();

  tourSchedule.tourId = faker.number.int({ min: 1, max: 10 });
  tourSchedule.departureDate = faker.date.future();
  tourSchedule.returnDate = faker.date.future();
  tourSchedule.availableSeats = faker.number.int({ min: 0, max: 10 });
  tourSchedule.maxSeats = faker.number.int({ min: 10, max: 20 });
  tourSchedule.basePrice = faker.number.int({ min: 100000, max: 1000000 });
  tourSchedule.adultPrice = faker.number.int({ min: 100000, max: 1000000 });
  tourSchedule.childPrice = faker.number.int({ min: 100000, max: 1000000 });
  tourSchedule.infantPrice = faker.number.int({ min: 100000, max: 1000000 });
  tourSchedule.seasonalMultiplier = faker.number.float({ min: 0.5, max: 2 });
  tourSchedule.specialDiscount = faker.number.float({ min: 0, max: 0.5 });
  tourSchedule.status = faker.helpers.arrayElement([
    TourScheduleStatus.AVAILABLE,
    TourScheduleStatus.FULL,
    TourScheduleStatus.CANCELLED,
  ]);

  return tourSchedule;
});
