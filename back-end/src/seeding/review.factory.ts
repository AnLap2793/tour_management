import { setSeederFactory } from 'typeorm-extension';
import { Review } from '../entities/review.entity';
import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';

let dataSource: DataSource;
let userIds: string[] = [];
let tourIds: string[] = [];

export const initializeDataSource = (ds: DataSource) => {
  dataSource = ds;
};

export const ReviewFactory = setSeederFactory(Review, async () => {
  const review = new Review();

  if (!dataSource)
    throw new Error('DataSource not initialized for ReviewFactory');

  if (!userIds.length) {
    const users = await dataSource.getRepository('User').find();
    userIds = users.map((u: any) => u.id);
  }

  if (!tourIds.length) {
    const tours = await dataSource.getRepository('Tour').find();
    tourIds = tours.map((t: any) => t.id);
  }

  review.userId = faker.helpers.arrayElement(userIds);
  review.tourId = faker.helpers.arrayElement(tourIds);
  review.rating = faker.number.int({ min: 1, max: 5 });
  review.comment = faker.lorem.sentence();
  review.status = faker.helpers.arrayElement(['active', 'inactive']);

  return review;
});
