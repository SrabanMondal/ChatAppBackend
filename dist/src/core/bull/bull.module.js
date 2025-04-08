"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyBull = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const myconfig_module_1 = require("../config/myconfig.module");
const myconfig_service_1 = require("../config/myconfig.service");
const email_module_1 = require("../email/email.module");
const email_service_1 = require("./email.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../database/sql/entity/user.entity");
const user_schema_1 = require("../../database/mongo/user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongo_service_1 = require("./mongo.service");
const message_schema_1 = require("../../database/mongo/message.schema");
let MyBull = class MyBull {
};
exports.MyBull = MyBull;
exports.MyBull = MyBull = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.forRootAsync({
                imports: [myconfig_module_1.MyConfig],
                inject: [myconfig_service_1.ConfigVal],
                useFactory: (configVal) => ({
                    redis: {
                        host: configVal.getRedisHost(),
                        port: configVal.getRedisPort(),
                        password: configVal.getRedisPass(),
                        tls: {},
                    },
                }),
            }),
            bull_1.BullModule.registerQueue({ name: 'email' }),
            bull_1.BullModule.registerQueue({ name: 'mongo' }),
            bull_1.BullModule.registerQueue({ name: 'message' }),
            myconfig_module_1.MyConfig,
            email_module_1.EmailModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.UserData.name, schema: user_schema_1.UserDataSchema },
                { name: message_schema_1.Message.name, schema: message_schema_1.MessageSchema },
            ]),
        ],
        providers: [email_service_1.EmailProcessor, mongo_service_1.MongoService],
        exports: [email_service_1.EmailProcessor, mongo_service_1.MongoService],
    })
], MyBull);
//# sourceMappingURL=bull.module.js.map