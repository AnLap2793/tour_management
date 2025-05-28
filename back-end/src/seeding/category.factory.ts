import { setSeederFactory } from 'typeorm-extension';
import { Category } from '../entities/category.entity';
import { faker } from '@faker-js/faker';

export const CategoryFactory = setSeederFactory(Category, () => {
  const category = new Category();
  category.name = faker.commerce.department();
  category.description = faker.commerce.productDescription();
  category.image = faker.image.url();
  category.slug = faker.helpers.slugify(category.name);
  category.status = faker.helpers.arrayElement(['active', 'inactive']);

  return category;
});
