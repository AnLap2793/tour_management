import { setSeederFactory } from 'typeorm-extension';
import { Tour } from '../entities/tour.entity';
import { faker } from '@faker-js/faker';

export const TourFactory = setSeederFactory(Tour, () => {
    const tour = new Tour();
    tour.name = faker.commerce.productName();
    tour.description = faker.commerce.productDescription();
    tour.image = faker.image.url();
    tour.basePrice = faker.number.int({ min: 100000, max: 1000000 });
    tour.duration = faker.number.int({ min: 1, max: 10 });
    tour.categoryId = faker.number.int({ min: 1, max: 10 });
    tour.locationId = faker.number.int({ min: 1, max: 10 });
    tour.departureLocationId = faker.number.int({ min: 1, max: 10 });
    tour.itinerary = faker.lorem.paragraph();
    tour.maxGroupSize = faker.number.int({ min: 10, max: 20 });
    tour.featured = faker.datatype.boolean();
    tour.status = faker.helpers.arrayElement(['active', 'inactive']);

    return tour;
});
