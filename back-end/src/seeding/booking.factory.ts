import { setSeederFactory } from 'typeorm-extension';
import { Booking } from '../entities/booking.entity';
import { faker } from '@faker-js/faker';

export const BookingFactory = setSeederFactory(Booking, () => {
  const booking = new Booking();
  booking.userId = faker.number.int({ min: 1, max: 10 });
  booking.tourId = faker.number.int({ min: 1, max: 10 });
  booking.scheduleId = faker.number.int({ min: 1, max: 10 });
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
