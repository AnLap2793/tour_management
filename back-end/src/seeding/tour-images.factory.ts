import { setSeederFactory } from 'typeorm-extension';
import { TourImage } from '../entities/tour-image.entity';
import { faker } from '@faker-js/faker';

export const TourImageFactory = setSeederFactory(TourImage, () => {
  const tourImage = new TourImage();
  tourImage.tourId = faker.number.int({ min: 1, max: 10 });
  tourImage.image = faker.image.url();
  tourImage.sortOrder = faker.number.int({ min: 0, max: 10 });

  return tourImage;
});
