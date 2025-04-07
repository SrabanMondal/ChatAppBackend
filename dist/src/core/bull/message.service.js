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
exports.MessageProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const redis_service_1 = require("../../chat/core/redis.service");
const message_schema_1 = require("../../database/mongo/message.schema");
let MessageProcessor = class MessageProcessor {
    messagequeue;
    messageModel;
    redisService;
    constructor(messagequeue, messageModel, redisService) {
        this.messagequeue = messagequeue;
        this.messageModel = messageModel;
        this.redisService = redisService;
    }
    async queueMessage(message) {
        await this.messagequeue.add('sendMessage', { message }, { attempts: 3, backoff: 5000 });
    }
    async sendMessage(job) {
        try {
            const message = job.data.message;
            await this.messageModel.create(message);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Message send failed' + error);
        }
    }
};
exports.MessageProcessor = MessageProcessor;
__decorate([
    (0, bull_1.Process)('sendMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageProcessor.prototype, "sendMessage", null);
exports.MessageProcessor = MessageProcessor = __decorate([
    (0, bull_1.Processor)('message'),
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)()),
    __param(1, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [Object, mongoose_2.Model,
        redis_service_1.RedisService])
], MessageProcessor);
//# sourceMappingURL=message.service.js.map