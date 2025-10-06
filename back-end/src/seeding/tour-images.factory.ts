import { setSeederFactory } from 'typeorm-extension';
import { TourImage } from '../entities/tour-image.entity';
import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';

let dataSource: DataSource;
let tourIds: string[] = [];

export const initializeDataSource = (ds: DataSource) => {
  dataSource = ds;
};

export const TourImageFactory = setSeederFactory(TourImage, async () => {
  const tourImage = new TourImage();

  if (!dataSource)
    throw new Error('DataSource not initialized for TourImageFactory');

  if (!tourIds.length) {
    const tours = await dataSource.getRepository('Tour').find();
    tourIds = tours.map((t: any) => t.id);
  }

  tourImage.tourId = faker.helpers.arrayElement(tourIds);
  tourImage.image = faker.image.url();
  tourImage.sortOrder = faker.number.int({ min: 0, max: 10 });

  return tourImage;
});
