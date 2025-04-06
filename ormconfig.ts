import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '.env') });
//console.log('Loaded SQL_URI:', process.env.SQL_URI);
export default new DataSource({
  type: 'mysql',
  url: process.env.SQL_URI,
  entities: ['src/database/sql/entity/*.entity.{js,ts}'],
  migrations: ['src/database/sql/migrations/*{.js,.ts}'],
});
