"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyConfig = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const myconfig_service_1 = require("./myconfig.service");
const Joi = require("joi");
let MyConfig = class MyConfig {
};
exports.MyConfig = MyConfig;
exports.MyConfig = MyConfig = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                validationSchema: Joi.object({
                    SQL_URI: Joi.string().uri().required(),
                    PORT: Joi.number().default(3000),
                    NODE_ENV: Joi.string().valid('DEV', 'PROD').default('DEV'),
                    FRONTEND: Joi.string().required(),
                    JWT: Joi.string().required(),
                    EMAIL_PASS: Joi.string().required(),
                    EMAIL_USER: Joi.string().required(),
                    REDIS_PORT: Joi.number().default(6379),
                    REDIS_HOST: Joi.string().default('localhost'),
                    REDIS_PASS: Joi.string().required(),
                    MONGO_URI: Joi.string().required(),
                }),
                validationOptions: {
                    abortEarly: false,
                    allowUnknown: true,
                    stripUnknown: false,
                },
                cache: true,
            }),
        ],
        providers: [myconfig_service_1.ConfigVal],
        exports: [myconfig_service_1.ConfigVal],
    })
], MyConfig);
//# sourceMappingURL=myconfig.module.js.map