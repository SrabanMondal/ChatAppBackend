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
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const redis_1 = require("redis");
const myconfig_service_1 = require("../../core/config/myconfig.service");
const message_schema_1 = require("../../database/mongo/message.schema");
let RedisService = class RedisService {
    messagemodel;
    myconfig;
    client;
    constructor(messagemodel, myconfig) {
        this.messagemodel = messagemodel;
        this.myconfig = myconfig;
        this.client = (0, redis_1.createClient)({
            url: myconfig.getRedisUrl(),
        });
        this.client
            .connect()
            .then(() => console.log('Redis Connected'))
            .catch(() => console.log('Error Connect'));
    }
    async setUserStatus(userId, status) {
        await this.client.set(`user:status:${userId}`, status, { EX: 3600 });
    }
    async getUserStatus(userId) {
        try {
            const status = await this.client.get(`user:status:${userId}`);
            return status;
        }
        catch (error) {
            console.error('No user exists:', error);
            return 'offline';
        }
    }
    async cacheMessages(roomId, messages) {
        await this.client.set(roomId, JSON.stringify(messages), { EX: 3600 });
    }
    async getCachedMessages(roomId) {
        const cachedMessages = await this.client.get(roomId);
        return cachedMessages
            ? JSON.parse(cachedMessages)
            : null;
    }
    async setSeenMessages(roomId, recieverId) {
        const messages = await this.client.get(roomId);
        if (!messages)
            return;
        const msgs = JSON.parse(messages);
        msgs.map((message) => {
            if (message.senderId == recieverId) {
                message.status = 'seen';
            }
        });
        await this.client.set(roomId, JSON.stringify(msgs), { EX: 3600 });
    }
    async getUserStatuses(userIds) {
        try {
            const keys = userIds.map((id) => `user:status:${id}`);
            console.log('Redis mGet Keys:', keys);
            const statuses = await this.client.mGet(keys);
            return statuses;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Could not get statuses' + String(error));
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        myconfig_service_1.ConfigVal])
], RedisService);
//# sourceMappingURL=redis.service.js.map