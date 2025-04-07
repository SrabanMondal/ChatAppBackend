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
exports.DatabaseCleaning = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../database/sql/entity/user.entity");
const typeorm_2 = require("typeorm");
const logger_service_1 = require("../logger/logger.service");
const schedule_1 = require("@nestjs/schedule");
let DatabaseCleaning = class DatabaseCleaning {
    userRepo;
    logger;
    constructor(userRepo, logger) {
        this.userRepo = userRepo;
        this.logger = logger;
    }
    async handleClean() {
        try {
            await this.userRepo.update({ resetPasswordExpires: (0, typeorm_2.LessThan)(new Date()) }, { resetPasswordOtp: undefined, resetPasswordExpires: undefined });
            this.logger.log('Cleaned Expired Reset Password Otps');
            await this.userRepo.update({ verificationExpires: (0, typeorm_2.LessThan)(new Date()) }, { verificationExpires: undefined });
        }
        catch (error) {
            this.logger.error(`Error cleaning expired Otps: ${error}`);
        }
    }
    async handleUnverifiedUsers() {
        try {
            const onDayAgo = new Date(Date.now() - 60 * 60 * 24 * 1000);
            await this.userRepo.delete({
                isVerified: false,
                createdAt: (0, typeorm_2.LessThan)(onDayAgo),
            });
            this.logger.log('Cleaned Unverified Users');
        }
        catch (error) {
            this.logger.error('Error deleting unverified users - ' + error);
        }
    }
};
exports.DatabaseCleaning = DatabaseCleaning;
__decorate([
    (0, schedule_1.Cron)('*/10 * * * *', { name: 'cleanExpiredOtps' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatabaseCleaning.prototype, "handleClean", null);
__decorate([
    (0, schedule_1.Cron)('0 0 * * *', { name: 'cleanUnverifiedUsers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatabaseCleaning.prototype, "handleUnverifiedUsers", null);
exports.DatabaseCleaning = DatabaseCleaning = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        logger_service_1.LogService])
], DatabaseCleaning);
//# sourceMappingURL=scheduler.service.js.map