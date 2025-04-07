"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
const user_seed_1 = require("./seeds/user.seed");
const admin_seed_1 = require("./seeds/admin.seed");
dotenv.config();
const runSeed = async (arg) => {
    const datasource = new typeorm_1.DataSource({
        type: 'mysql',
        url: process.env.SQL_URI,
        entities: ['src/database/sql/entity/*.entity.{js,ts}'],
        migrations: ['src/database/sql/migrations/*.{js,ts}'],
    });
    await datasource.initialize();
    try {
        if (arg == 'admin') {
            await (0, admin_seed_1.seedAdmin)(datasource);
        }
        else {
            await (0, user_seed_1.seedUser)(datasource);
        }
    }
    catch (error) {
        console.error('Seeding failed', error);
    }
    finally {
        await datasource.destroy();
    }
};
runSeed(process.argv[2])
    .then(() => console.log('Seeding succeeded'))
    .catch(() => console.log('Seeding failed'));
//# sourceMappingURL=seed.js.map