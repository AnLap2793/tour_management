import { setSeederFactory } from 'typeorm-extension';
import { Booking } from '../entities/booking.entity';
import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';

let dataSource: DataSource;
let userIds: string[] = [];
let tourIds: string[] = [];
let scheduleIds: string[] = [];

export const initializeDataSource = (ds: DataSource) => {
  dataSource = ds;
};

export const BookingFactory = setSeederFactory(Booking, async () => {
  const booking = new Booking();

  if (!dataSource)
    throw new Error('DataSource not initialized for BookingFactory');

  if (!userIds.length) {
    const users = await dataSource.getRepository('User').find();
    userIds = users.map((u: any) => u.id);
  }

  if (!tourIds.length) {
    const tours = await dataSource.getRepository('Tour').find();
    tourIds = tours.map((t: any) => t.id);
  }

  if (!scheduleIds.length) {
    const schedules = await dataSource.getRepository('TourSchedule').find();
    scheduleIds = schedules.map((s: any) => s.id);
  }

  booking.userId = faker.helpers.arrayElement(userIds);
  booking.tourId = faker.helpers.arrayElement(tourIds);
  booking.scheduleId = faker.helpers.arrayElement(scheduleIds);
  booking.numberOfAdults = faker.number.int({ min: 1, max: 5 });
  booking.numberOfChildren = faker.number.int({ min: 0, max: 3 });
  booking.numberOfInfants = faker.number.int({ min: 0, max: 2 });
  booking.totalPrice = faker.number.int({ min: 100000, max: 1000000 });
  booking.status = faker.helpers.arrayElement([
    'pending',
    'confirmed',
    'cancelled',
  ]);
  booking.paymentStatus = faker.helpers.arrayElement([
    'pending',
    'paid',
    'failed',
  ]);
  booking.paymentMethod = faker.helpers.arrayElement([
    'vnpay',
    'momo',
    'zalopay',
  ]);
  booking.transactionId = faker.string.uuid();
  booking.specialRequests = faker.lorem.sentence();

  return booking;
});
