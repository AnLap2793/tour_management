import { dbOptions } from '../db/data-source';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeder, SeederOptions } from 'typeorm-extension';
import { MainSeeder } from './main.seeder';
import { UserFactory } from './user.factory';
import { CategoryFactory } from './category.factory';
import { LocationFactory } from './location.factory';
import { DepartureLocationFactory } from './departure-location.factory';
import { TourFactory } from './tour.factory';
import { BookingFactory } from './booking.factory';
import { TourImageFactory } from './tour-images.factory';
import { TourScheduleFactory } from './tour-schedule.factory';
import { ReviewFactory } from './review.factory';

const options: DataSourceOptions & SeederOptions = {
  ...dbOptions,
  factories: [
    UserFactory,
    CategoryFactory,
    LocationFactory,
    DepartureLocationFactory,
    TourFactory,
    TourScheduleFactory,
    BookingFactory,
    ReviewFactory,
    TourImageFactory,
  ],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);

dataSource
  .initialize()
  .then(async () => {
    await dataSource.synchronize(true);
    await runSeeder(dataSource, MainSeeder);
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
  });
