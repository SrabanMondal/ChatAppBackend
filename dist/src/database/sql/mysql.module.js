"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const myconfig_module_1 = require("../../core/config/myconfig.module");
const myconfig_service_1 = require("../../core/config/myconfig.service");
const AdminSubscriber_1 = require("./subscribers/AdminSubscriber");
const logger_module_1 = require("../../core/logger/logger.module");
let MySqlModule = class MySqlModule {
};
exports.MySqlModule = MySqlModule;
exports.MySqlModule = MySqlModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [myconfig_module_1.MyConfig],
                inject: [myconfig_service_1.ConfigVal],
                useFactory: (config) => ({
                    type: 'mysql',
                    url: config.getSqlUri(),
                    entities: [__dirname + '/entity/*.entity.{js,ts}'],
                    migrations: [__dirname + '/migrations/*.{js,ts}'],
                    synchronize: config.getNodeEnv() == 'DEV' ? true : false,
                    logging: config.getNodeEnv() == 'DEV' ? 'all' : false,
                    autoLoadEntities: true,
                    poolSize: 10,
                    subscribers: [AdminSubscriber_1.AdminSubscriber],
                    connectTimeout: 30000,
                    retryAttempts: 5,
                    retryDelay: 3000,
                }),
            }),
            logger_module_1.MyLogger,
        ],
        providers: [AdminSubscriber_1.AdminSubscriber],
    })
], MySqlModule);
//# sourceMappingURL=mysql.module.js.map