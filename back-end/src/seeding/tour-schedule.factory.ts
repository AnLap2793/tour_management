import { setSeederFactory } from 'typeorm-extension';
import { TourSchedule } from '../entities/tour-schedule.entity';
import { faker } from '@faker-js/faker';
import { TourScheduleStatus } from '../entities/tour-schedule.entity';
import { DataSource } from 'typeorm';

let dataSource: DataSource;
let tourIds: string[] = [];

export const initializeDataSource = (ds: DataSource) => {
  dataSource = ds;
};

export const TourScheduleFactory = setSeederFactory(TourSchedule, async () => {
  const tourSchedule = new TourSchedule();

  // load tour ids once
  if (!tourIds.length) {
    if (!dataSource)
      throw new Error('DataSource not initialized for TourScheduleFactory');
    const tours = await dataSource.getRepository('Tour').find();
    tourIds = tours.map((t: any) => t.id);
    if (!tourIds.length)
      throw new Error(
        'No tours found. Ensure tours are seeded before schedules.',
      );
  }

  tourSchedule.tourId = faker.helpers.arrayElement(tourIds);
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
