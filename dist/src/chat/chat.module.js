"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const chat_controller_1 = require("./chat.controller");
const chat_gatway_1 = require("./core/chat.gatway");
const redis_service_1 = require("./core/redis.service");
const bull_module_1 = require("../core/bull/bull.module");
const user_schema_1 = require("../database/mongo/user.schema");
const room_schema_1 = require("../database/mongo/room.schema");
const message_schema_1 = require("../database/mongo/message.schema");
const mongoose_1 = require("@nestjs/mongoose");
const logger_module_1 = require("../core/logger/logger.module");
const myconfig_module_1 = require("../core/config/myconfig.module");
const auth_module_1 = require("../core/auth/auth.module");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.UserData.name, schema: user_schema_1.UserDataSchema },
                { name: room_schema_1.Room.name, schema: room_schema_1.RoomSchema },
                { name: message_schema_1.Message.name, schema: message_schema_1.MessageSchema },
            ]),
            logger_module_1.MyLogger,
            bull_module_1.MyBull,
            myconfig_module_1.MyConfig,
            auth_module_1.AuthModule,
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [chat_service_1.ChatService, chat_gatway_1.ChatGateway, redis_service_1.RedisService],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map