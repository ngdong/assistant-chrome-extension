import { MongoClient } from '../../deps.ts';
import { DB_NAME, DB_HOST_URL } from '../config/config.ts';

const client = new MongoClient();
await client.connect(DB_HOST_URL);
const db = client.database(DB_NAME);

export default db;
