import { Booking } from '../entities/booking.entity';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';
import { Tour } from '../entities/tour.entity';
import { Review } from '../entities/review.entity';
import { Location } from '../entities/location.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { TourSchedule } from '../entities/tour-schedule.entity';
import { TourImage } from '../entities/tour-image.entity';
import { DepartureLocation } from '../entities/departure-location.entity';

export class MainSeeder implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    try {
      console.log('Starting data seeding...');

      // 1. Create Users first
      console.log('Creating users...');
      const userFactory = factoryManager.get(User);
      const users = await userFactory.saveMany(10);
      console.log(`Created ${users.length} users successfully!`);

      // 2. Create Categories
      console.log('Creating categories...');
      const categoryFactory = factoryManager.get(Category);
      const categories = await categoryFactory.saveMany(10);
      console.log(`Created ${categories.length} categories successfully!`);

      // 3. Create Locations
      console.log('Creating locations...');
      const locationFactory = factoryManager.get(Location);
      const locations = await locationFactory.saveMany(15);
      console.log(`Created ${locations.length} locations successfully!`);

      // 4. Create Departure Locations
      console.log('Creating departure locations...');
      const departureLocationFactory = factoryManager.get(DepartureLocation);
      const departureLocations = await departureLocationFactory.saveMany(5);
      console.log(
        `✅ Created ${departureLocations.length} departure locations successfully!`,
      );

      // 5. Create Tours (depends on Category, Location, DepartureLocation)
      console.log('Creating tours...');
      const tourFactory = factoryManager.get(Tour);
      const tours = await tourFactory.saveMany(20);
      console.log(`Created ${tours.length} tours successfully!`);

      // 6. Create Tour Schedules (depends on Tour)
      console.log('Creating tour schedules...');
      const tourScheduleFactory = factoryManager.get(TourSchedule);
      const tourSchedules = await tourScheduleFactory.saveMany(50);
      console.log(
        `Created ${tourSchedules.length} tour schedules successfully!`,
      );

      // 7. Create Tour Images (depends on Tour)
      console.log('Creating tour images...');
      const tourImageFactory = factoryManager.get(TourImage);
      const tourImages = await tourImageFactory.saveMany(60);
      console.log(`Created ${tourImages.length} tour images successfully!`);

      // 8. Create Bookings (depends on User, Tour, TourSchedule)
      console.log('Creating bookings...');
      const bookingFactory = factoryManager.get(Booking);
      const bookings = await bookingFactory.saveMany(30);
      console.log(`Created ${bookings.length} bookings successfully!`);

      // 9. Create Reviews (depends on User, Tour, and potentially Booking)
      console.log('Creating reviews...');
      const reviewFactory = factoryManager.get(Review);
      const reviews = await reviewFactory.saveMany(40);
      console.log(`Created ${reviews.length} reviews successfully!`);

      console.log('Data seeding completed successfully!');

      // Summary
      console.log('\nSeeding Summary:');
      console.log(`- Users: ${users.length}`);
      console.log(`- Categories: ${categories.length}`);
      console.log(`- Locations: ${locations.length}`);
      console.log(`- Departure Locations: ${departureLocations.length}`);
      console.log(`- Tours: ${tours.length}`);
      console.log(`- Tour Schedules: ${tourSchedules.length}`);
      console.log(`- Tour Images: ${tourImages.length}`);
      console.log(`- Bookings: ${bookings.length}`);
      console.log(`- Reviews: ${reviews.length}`);
    } catch (error) {
      console.error('Error during seeding:', error);
      throw error;
    }
  }
}
