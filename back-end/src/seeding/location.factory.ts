import { setSeederFactory } from 'typeorm-extension';
import { Location } from '../entities/location.entity';
import { faker } from '@faker-js/faker';

export const LocationFactory = setSeederFactory(Location, () => {
  const location = new Location();
  location.name = faker.location.city();
  location.description = faker.lorem.sentence();
  location.image = faker.image.url();
  location.country = faker.location.country();
  location.region = faker.location.state();
  location.latitude = faker.location.latitude();
  location.longitude = faker.location.longitude();
  location.popularityScore = faker.number.int({ min: 0, max: 100 });
  location.status = faker.helpers.arrayElement(['active', 'inactive']);

  return location;
});
