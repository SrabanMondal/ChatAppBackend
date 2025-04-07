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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigVal = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ConfigVal = class ConfigVal {
    configService;
    config;
    constructor(configService) {
        this.configService = configService;
        const sqluri = configService.get('SQL_URI');
        const port = configService.get('PORT');
        const nodeenv = configService.get('NODE_ENV');
        const frontend = configService.get('FRONTEND');
        const jwt = configService.get('JWT');
        const user = configService.get('EMAIL_USER');
        const pass = configService.get('EMAIL_PASS');
        const redis_port = configService.get('REDIS_PORT');
        const redis_host = configService.get('REDIS_HOST');
        const mongo_uri = configService.get('MONGO_URI');
        const redis_pass = configService.get('REDIS_PASS');
        if (!sqluri) {
            throw new common_1.BadRequestException('Missing sql URI');
        }
        if (!port) {
            throw new common_1.BadRequestException('Missing port');
        }
        if (!nodeenv) {
            throw new common_1.BadRequestException('Missing nodenv');
        }
        if (!frontend) {
            throw new common_1.BadRequestException('Missing frontend');
        }
        if (!jwt) {
            throw new common_1.BadRequestException('Missing JWT');
        }
        if (!user) {
            throw new common_1.BadRequestException('Missing email user');
        }
        if (!pass) {
            throw new common_1.BadRequestException('Missing email password');
        }
        if (!redis_port) {
            throw new common_1.BadRequestException('Missing redis port');
        }
        if (!redis_host) {
            throw new common_1.BadRequestException('Missing redis host');
        }
        if (!mongo_uri) {
            throw new common_1.BadRequestException('Missing mongo URI');
        }
        if (!redis_pass) {
            throw new common_1.BadRequestException('Missing redis password');
        }
        this.config = {
            SQL_URI: sqluri,
            PORT: port,
            NODE_ENV: nodeenv,
            FRONTEND: frontend,
            JWT: jwt,
            EMAIL_USER: user,
            EMAIL_PASS: pass,
            REDIS_HOST: redis_host,
            REDIS_PORT: redis_port,
            MONGO_URI: mongo_uri,
            REDIS_PASS: redis_pass,
        };
    }
    getSqlUri() {
        return this.config.SQL_URI;
    }
    getNodeEnv() {
        return this.config.NODE_ENV;
    }
    getPort() {
        return this.config.PORT;
    }
    getFrontend() {
        return this.config.FRONTEND;
    }
    getJwt() {
        return this.config.JWT;
    }
    getUser() {
        return this.config.EMAIL_USER;
    }
    getPass() {
        return this.config.EMAIL_PASS;
    }
    getRedisHost() {
        return this.config.REDIS_HOST;
    }
    getRedisPort() {
        return this.config.REDIS_PORT;
    }
    getMongoUri() {
        return this.config.MONGO_URI;
    }
    getRedisPass() {
        return this.config.REDIS_PASS;
    }
    getRedisUrl() {
        return `rediss://default:${this.config.REDIS_PASS}@${this.config.REDIS_HOST}:${this.config.REDIS_PORT}`;
    }
};
exports.ConfigVal = ConfigVal;
exports.ConfigVal = ConfigVal = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ConfigVal);
//# sourceMappingURL=myconfig.service.js.map