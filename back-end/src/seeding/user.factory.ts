import { setSeederFactory } from 'typeorm-extension';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { Faker, faker } from '@faker-js/faker';

export const UserFactory = setSeederFactory(User, () => {
  const user = new User();
  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  user.phone = faker.phone.number();
  user.address = faker.location.streetAddress();
  user.role = faker.helpers.arrayElement([UserRole.USER, UserRole.ADMIN]);
  user.status = faker.helpers.arrayElement([
    UserStatus.ACTIVE,
    UserStatus.INACTIVE,
  ]);

  return user;
});
