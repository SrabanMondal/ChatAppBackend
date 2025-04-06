import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { seedUser } from './seeds/user.seed';
import { seedAdmin } from './seeds/admin.seed';
dotenv.config();
const runSeed = async (arg: string) => {
  const datasource = new DataSource({
    type: 'mysql',
    url: process.env.SQL_URI,
    entities: ['src/database/sql/entity/*.entity.{js,ts}'],
    migrations: ['src/database/sql/migrations/*.{js,ts}'],
  });
  await datasource.initialize();
  try {
    if (arg == 'admin') {
      await seedAdmin(datasource);
    } else {
      await seedUser(datasource);
    }
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await datasource.destroy();
  }
};
runSeed(process.argv[2])
  .then(() => console.log('Seeding succeeded'))
  .catch(() => console.log('Seeding failed'));
