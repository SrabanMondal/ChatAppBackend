"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '.env') });
exports.default = new typeorm_1.DataSource({
    type: 'mysql',
    url: process.env.SQL_URI,
    entities: ['src/database/sql/entity/*.entity.{js,ts}'],
    migrations: ['src/database/sql/migrations/*{.js,.ts}'],
});
//# sourceMappingURL=ormconfig.js.map