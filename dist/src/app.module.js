"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const myconfig_module_1 = require("./core/config/myconfig.module");
const logger_module_1 = require("./core/logger/logger.module");
const logger_service_1 = require("./core/logger/logger.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mysql_module_1 = require("./database/sql/mysql.module");
const throttler_1 = require("@nestjs/throttler");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./core/auth/auth.module");
const scheduler_module_1 = require("./core/scheduler/scheduler.module");
const mongo_module_1 = require("./database/mongo/mongo.module");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_module_1 = require("./chat/chat.module");
let AppModule = class AppModule {
    logger;
    datasource;
    connection;
    constructor(logger, datasource, connection) {
        this.logger = logger;
        this.datasource = datasource;
        this.connection = connection;
    }
    async onModuleInit() {
        try {
            await this.datasource.query('SELECT 1');
            this.logger.log('Connected to the database successfully');
            const mongoStatus = this.connection.readyState;
            if (mongoStatus === mongoose_2.ConnectionStates.connected) {
                this.logger.log('MongoDB connected (readyState: 1)');
            }
            else if (mongoStatus === mongoose_2.ConnectionStates.disconnected) {
                this.logger.error('MongoDB disconnected (readyState: 0)');
            }
            else if (mongoStatus === mongoose_2.ConnectionStates.connecting) {
                this.logger.warn('MongoDB connecting (readyState: 2)');
            }
            else if (mongoStatus === mongoose_2.ConnectionStates.disconnecting) {
                this.logger.warn('MongoDB disconnecting (readyState: 3)');
            }
        }
        catch (error) {
            if (error instanceof typeorm_2.QueryFailedError) {
                this.logger.error('Failed to connect to the database (QueryFailed)', error.message);
            }
            else if (error instanceof Error) {
                this.logger.error('Failed to connect to the database', error.stack || error.message);
            }
            else {
                this.logger.error('Unexpected failure while connecting to database', String(error));
            }
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            myconfig_module_1.MyConfig,
            logger_module_1.MyLogger,
            scheduler_module_1.MyScheduler,
            user_module_1.UserModule,
            chat_module_1.ChatModule,
            auth_module_1.AuthModule,
            mongo_module_1.MyMongo,
            mysql_module_1.MySqlModule,
            throttler_1.ThrottlerModule.forRoot({ throttlers: [{ limit: 10, ttl: 60000 }] }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __param(1, (0, common_1.Inject)((0, typeorm_1.getDataSourceToken)())),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [logger_service_1.LogService,
        typeorm_2.DataSource,
        mongoose_2.Connection])
], AppModule);
//# sourceMappingURL=app.module.js.map