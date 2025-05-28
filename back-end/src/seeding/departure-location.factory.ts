import { setSeederFactory } from 'typeorm-extension';
import { DepartureLocation } from '../entities/departure-location.entity';
import { faker } from '@faker-js/faker';

export const DepartureLocationFactory = setSeederFactory(
  DepartureLocation,
  () => {
    const departureLocation = new DepartureLocation();
    departureLocation.name = faker.location.streetAddress();
    departureLocation.address = faker.location.streetAddress();
    departureLocation.city = faker.location.city();
    departureLocation.province = faker.location.state();
    departureLocation.latitude = faker.location.latitude();
    departureLocation.longitude = faker.location.longitude();
    departureLocation.meetingPoint = faker.lorem.sentence();
    departureLocation.status = faker.helpers.arrayElement([
      'active',
      'inactive',
    ]);

    return departureLocation;
  },
);
