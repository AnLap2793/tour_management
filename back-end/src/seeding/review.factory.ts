import { setSeederFactory } from 'typeorm-extension';
import { Review } from '../entities/review.entity';
import { faker } from '@faker-js/faker';

export const ReviewFactory = setSeederFactory(Review, () => {
  const review = new Review();
  review.userId = faker.number.int({ min: 1, max: 10 });
  review.tourId = faker.number.int({ min: 1, max: 10 });
  review.rating = faker.number.int({ min: 1, max: 5 });
  review.comment = faker.lorem.sentence();
  review.status = faker.helpers.arrayElement(['active', 'inactive']);

  return review;
});
