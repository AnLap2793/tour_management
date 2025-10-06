import { setSeederFactory } from 'typeorm-extension';
import { Category } from '../entities/category.entity';
import { faker } from '@faker-js/faker';

export const CategoryFactory = setSeederFactory(Category, () => {
  const category = new Category();
  const baseName = faker.commerce.department();
  category.name = `${baseName} ${faker.number.int({ min: 1, max: 1000 })}`;
  category.description = faker.commerce.productDescription();
  category.image = faker.image.url();
  category.slug = faker.helpers.slugify(category.name);
  category.status = faker.helpers.arrayElement(['active', 'inactive']);

  return category;
});
