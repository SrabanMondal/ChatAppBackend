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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const chat_service_1 = require("./chat.service");
const chat_types_1 = require("./core/chat.types");
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    async search(req, name) {
        const id = req.user.id;
        console.log(id, name);
        const users = await this.chatService.getUsers(name, id);
        return { users };
    }
    async addFriend(addFriendDto, req) {
        const userId = req.user.id;
        const { friendId } = addFriendDto;
        if (!friendId || isNaN(friendId)) {
            throw new common_1.BadRequestException('Invalid friend ID');
        }
        if (userId === friendId) {
            throw new common_1.BadRequestException('Cannot add yourself as a friend');
        }
        const friendExists = await this.chatService.getUser(friendId);
        if (!friendExists) {
            throw new common_1.NotFoundException('Friend not found');
        }
        const isAlreadyFriend = await this.chatService.isFriend(userId, friendId);
        if (isAlreadyFriend) {
            throw new common_1.BadRequestException('Friend already added');
        }
        await this.chatService.addFriend(userId, friendId);
        return { message: 'Friend added successfully' };
    }
    async getFriends(req) {
        const userId = req.user.id;
        const friends = await this.chatService.getFriends(userId);
        return { friends };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('search/:name'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "search", null);
__decorate([
    (0, common_1.Post)('friends'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_types_1.AddFriendDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Get)('friends'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getFriends", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)({
        version: '1',
        path: 'chat',
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map