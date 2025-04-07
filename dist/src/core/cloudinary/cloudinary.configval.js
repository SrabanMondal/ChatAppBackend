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
exports.CloudinaryConfigVal = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let CloudinaryConfigVal = class CloudinaryConfigVal {
    configService;
    config;
    constructor(configService) {
        this.configService = configService;
        const api_key = configService.get('CLOUDINARY_API_KEY');
        const api_secret = configService.get('CLOUDINARY_API_SECRET');
        const cloud_name = configService.get('CLOUDINARY_CLOUD_NAME');
        if (!cloud_name) {
            throw new common_1.BadRequestException('Missing CLOUDINARY_CLOUD_NAME');
        }
        if (!api_key) {
            throw new common_1.BadRequestException('Missing CLOUDINARY_API_KEY');
        }
        if (!api_secret) {
            throw new common_1.BadRequestException('Missing CLOUDINARY_API_SECRET');
        }
        this.config = {
            CLOUDINARY_API_KEY: api_key,
            CLOUDINARY_API_SECRET: api_secret,
            CLOUDINARY_CLOUD_NAME: cloud_name,
        };
    }
    getCloudinaryConfig() {
        return this.config;
    }
};
exports.CloudinaryConfigVal = CloudinaryConfigVal;
exports.CloudinaryConfigVal = CloudinaryConfigVal = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryConfigVal);
//# sourceMappingURL=cloudinary.configval.js.map