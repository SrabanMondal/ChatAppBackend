"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyMongo = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const myconfig_module_1 = require("../../core/config/myconfig.module");
const myconfig_service_1 = require("../../core/config/myconfig.service");
const logger_module_1 = require("../../core/logger/logger.module");
const logger_service_1 = require("../../core/logger/logger.service");
let MyMongo = class MyMongo {
};
exports.MyMongo = MyMongo;
exports.MyMongo = MyMongo = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                imports: [myconfig_module_1.MyConfig, logger_module_1.MyLogger],
                inject: [myconfig_service_1.ConfigVal, logger_service_1.LogService],
                useFactory: (config) => ({
                    uri: config.getMongoUri(),
                }),
            }),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], MyMongo);
//# sourceMappingURL=mongo.module.js.map