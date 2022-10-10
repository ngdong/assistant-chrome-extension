import { DataSource, DataSourceOptions } from 'typeorm';
import DatabaseLogger from './database-logger';
import { resolve } from 'path';

const entitiesPath = resolve(__dirname, '..', 'entities');
const migrationsPath = resolve(__dirname, '..', 'migrations');

const connectOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_INSTANCE,
  synchronize: Boolean(process.env.DB_SYNCHRONIZE),
  entities: [entitiesPath.concat('/*.entity.{t,j}s')],
  migrations: [migrationsPath.concat('/*.{t,j}s')],
  logger: new DatabaseLogger(),
};

const DB = new DataSource(connectOptions);
export default DB;
