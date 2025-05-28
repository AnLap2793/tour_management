// src/db/data-source.ts
import { config } from 'dotenv';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { join } from 'path';

config();

export const dbOptions: MysqlConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tour_management',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')], // Sửa đường dẫn
  synchronize: true,
};
