import { DataSource } from 'typeorm';
import { setSeederFactory } from 'typeorm-extension';
import { Tour } from '../entities/tour.entity';
import { Category } from '../entities/category.entity';
import { Location } from '../entities/location.entity';
import { DepartureLocation } from '../entities/departure-location.entity';

// Khởi tạo biến để lưu trữ DataSource
let dataSource: DataSource;

export const initializeDataSource = (ds: DataSource) => {
  dataSource = ds;
};

let categories: Category[] = [];
let locations: Location[] = [];
let departureLocations: DepartureLocation[] = [];

export const TourFactory = setSeederFactory(Tour, async (faker) => {
  if (!dataSource) {
    throw new Error(
      'DataSource not initialized. Call initializeDataSource first.',
    );
  }
  // Initialize data if not already loaded
  if (categories.length === 0) {
    try {
      categories = await dataSource.getRepository(Category).find();
      locations = await dataSource.getRepository(Location).find();
      departureLocations = await dataSource
        .getRepository(DepartureLocation)
        .find();
    } catch (error) {
      console.error('Error loading reference data:', error);
      throw error;
    }

    if (!categories.length || !locations.length || !departureLocations.length) {
      throw new Error(
        'Make sure to run category, location, and departure location seeders first',
      );
    }

    const tour = new Tour();
    tour.name = faker.commerce.productName();
    tour.description = faker.commerce.productDescription();
    tour.image = faker.image.url();
    tour.basePrice = faker.number.int({ min: 100000, max: 1000000 });
    tour.duration = faker.number.int({ min: 1, max: 10 });

    // Use existing IDs from database
    const randomCategory = faker.helpers.arrayElement(categories);
    const randomLocation = faker.helpers.arrayElement(locations);
    const randomDepartureLocation =
      faker.helpers.arrayElement(departureLocations);

    tour.categoryId = randomCategory.id;
    tour.locationId = randomLocation.id;
    tour.departureLocationId = randomDepartureLocation.id;

    tour.itinerary = faker.lorem.paragraph();
    tour.maxGroupSize = faker.number.int({ min: 10, max: 20 });
    tour.featured = faker.datatype.boolean();
    tour.status = faker.helpers.arrayElement(['active', 'inactive']);

    return tour;
  }
});
