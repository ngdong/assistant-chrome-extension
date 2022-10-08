import { DataSource, DataSourceOptions } from 'typeorm';
import DatabaseLogger from './database-logger';

const connectOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_INSTANCE,
  synchronize: Boolean(process.env.DB_SYNCHRONIZE),
  entities: ['build/**/*.entity{.ts,.js}'],
  migrations: ['build/migrations/*.{.ts,.js}'],
  logger: new DatabaseLogger(),
};

const DB = new DataSource(connectOptions);
export default DB;
