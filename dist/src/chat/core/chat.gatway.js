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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
const redis_service_1 = require("./redis.service");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("../chat.service");
const logger_service_1 = require("../../core/logger/logger.service");
const myconfig_service_1 = require("../../core/config/myconfig.service");
const auth_service_1 = require("../../core/auth/auth.service");
const ws_exception_1 = require("../../core/filters/ws-exception");
let ChatGateway = class ChatGateway {
    redisService;
    chatService;
    logger;
    configservice;
    authService;
    server;
    constructor(redisService, chatService, logger, configservice, authService) {
        this.redisService = redisService;
        this.chatService = chatService;
        this.logger = logger;
        this.configservice = configservice;
        this.authService = authService;
        this.afterInit()
            .then(() => logger.log('Socket connected'))
            .catch(() => logger.log('Socket errror'));
    }
    async afterInit() {
        try {
            const pubClient = (0, redis_1.createClient)({ url: this.configservice.getRedisUrl() });
            const subClient = pubClient.duplicate();
            await Promise.all([pubClient.connect(), subClient.connect()]);
            this.server.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
            this.logger.log('Redis adapter initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Redis adapter', String(error));
            throw new Error('Redis adapter initialization failed');
        }
    }
    async handleConnection(socket) {
        try {
            const token = socket.handshake.query?.userId;
            if (!token) {
                socket.emit('exception', {
                    status: 'error',
                    message: 'Authentication token missing',
                    code: 'AUTH_MISSING',
                    timestamp: new Date().toISOString(),
                    data: null,
                });
                socket.disconnect();
                return;
            }
            const userdata = this.authService.decodetoken(token || '');
            const userId = userdata.id;
            this.logger.log(`userid: ${userId}`);
            socket.data.user = { id: Number(userId) };
            if (!userId) {
                socket.disconnect();
                return;
            }
            const user = await this.chatService.getUser(userId);
            if (!user) {
                socket.disconnect();
                throw new common_1.UnauthorizedException('User not exists');
            }
            if (socket.data.disconnectTimeout) {
                clearTimeout(socket.data.disconnectTimeout);
                socket.data.disconnectTimeout = null;
            }
            await socket.join(`user_${userId}`);
            await this.redisService.setUserStatus(userId, 'online');
            const friends = await this.chatService.getFriends(userId);
            if (friends && friends.length > 0) {
                friends.forEach((friend) => this.server.to(`user_${friend.id.toString()}`).emit('userStatus', {
                    userId,
                    status: 'online',
                }));
            }
        }
        catch (error) {
            this.logger.debug(String(error));
            socket.disconnect();
        }
    }
    handleDisconnect(socket) {
        const userId = socket.data.user?.id;
        if (socket.data.disconnectTimeout) {
            clearTimeout(socket.data.disconnectTimeout);
            socket.data.disconnectTimeout = null;
        }
        if (!userId)
            return;
        socket.data.disconnectTimeout = setTimeout(() => {
            (async () => {
                try {
                    const sockets = await this.server.in(`user_${userId}`).fetchSockets();
                    if (sockets.length === 0) {
                        await this.redisService.setUserStatus(userId, 'offline');
                        const friends = await this.chatService.getFriends(userId);
                        friends.forEach((friend) => this.server
                            .to(`user_${friend.id.toString()}`)
                            .emit('userStatus', {
                            userId,
                            status: 'offline',
                        }));
                        this.logger.log(`User ${userId} is offline, notified friends`);
                    }
                    else {
                        this.logger.log(`User ${userId} still has ${sockets.length} active connections`);
                    }
                }
                catch (error) {
                    this.logger.error(`Disconnect error for user ${userId}:`, String(error));
                }
                finally {
                    socket.data.disconnectTimeout = null;
                }
            })().catch((error) => {
                this.logger.error(`Uncaught disconnect error for user ${userId}:`, String(error));
            });
        }, 5000);
    }
    async getOnlineFriends(socket, payload) {
        const { userId } = payload;
        if (!userId)
            return;
        const friends = await this.chatService.getFriends(userId);
        const friendIds = friends.map((friend) => friend.id);
        const friendStatuses = await this.redisService.getUserStatuses(friendIds);
        const onlineFriends = friends.filter((friend, index) => friendStatuses[index] === 'online');
        this.server.to(`user_${userId}`).emit('onlineFriends', onlineFriends);
    }
    async joinRoom(socket, payload) {
        const userId = socket.data.user?.id;
        if (!userId)
            return;
        const { recieverId } = payload;
        this.logger.debug(`${userId} joining room with ${recieverId}`);
        if (!recieverId || isNaN(recieverId) || recieverId === userId) {
            socket.emit('error', { message: 'Invalid receiver ID' });
            return;
        }
        const isAllowed = await this.chatService.canJoinRoom(userId, recieverId);
        this.logger.debug(`is aloow ${isAllowed}`);
        if (!isAllowed) {
            socket.emit('error', { message: 'Not authorized to join this room' });
            return;
        }
        const roomId = `room_${Math.min(userId, recieverId)}_${Math.max(userId, recieverId)}`;
        const room = await this.chatService.getorCreateRoom(roomId, userId, recieverId);
        await socket.join(roomId);
        this.server
            .to(`user_${userId}`)
            .emit('roomJoined', { roomId, participants: room.participants });
        const messages = await this.redisService.getCachedMessages(roomId);
        if (messages && messages.length > 0) {
            socket.emit('chatHistory', messages);
        }
        else {
            const messages = await this.chatService.getPastMessages(roomId);
            if (messages && messages.length > 0) {
                await this.redisService.cacheMessages(roomId, messages);
                socket.emit('chatHistory', messages);
            }
            else {
                socket.emit('chatHistory', []);
                this.logger.warn(`No messages found for room ${roomId}`);
            }
        }
        await this.redisService.setSeenMessages(roomId, recieverId);
        await this.chatService.readMessages(roomId, recieverId);
        const receiver_status = await this.redisService.getUserStatus(recieverId);
        if (receiver_status == 'online') {
            this.server
                .to(`user_${recieverId}`)
                .emit('seenMessages', { recieverId, roomId, userId });
        }
    }
    async sendMessage(socket, payload) {
        const { message, receiverId } = payload;
        const userId = socket.data.user?.id;
        if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
        }
        if (!receiverId || isNaN(receiverId) || !message || !message.content) {
            socket.emit('error', { message: 'Invalid message or receiver ID' });
            return;
        }
        const isAllowed = await this.chatService.canJoinRoom(userId, receiverId);
        if (!isAllowed) {
            socket.emit('error', { message: 'Not authorized to join this room' });
            return;
        }
        const status = await this.redisService.getUserStatus(receiverId);
        this.logger.debug(`Message sent`);
        const messagesaved = await this.chatService.saveMessage(message);
        this.logger.debug(`Message saved to mongo and sent`);
        if (status === 'online') {
            socket.to(message.roomId).emit('sendMessage', messagesaved);
        }
        this.logger.log(`User ${userId} sent message to room ${message.roomId}`);
        this.server
            .to(`user_${receiverId}`)
            .emit('newMessageNotification', messagesaved);
        const cachedMessages = await this.redisService.getCachedMessages(message.roomId);
        if (cachedMessages) {
            cachedMessages.push(messagesaved);
            await this.redisService.cacheMessages(message.roomId, cachedMessages);
        }
        this.server.to(`user_${userId}`).emit('messageSent', messagesaved);
    }
    async messageSeen(socket, payload) {
        const { message } = payload;
        this.logger.log(`User ${message.senderId} has seen message in room ${message.roomId}`);
        await this.redisService.setSeenMessages(message.roomId, message.senderId);
        await this.chatService.readMessage(message);
        this.server.to(`user_${message.senderId}`).emit('messageSeen', message);
    }
    async leaveRoom(socket, payload) {
        const { roomId } = payload;
        await socket.leave(roomId);
        socket.emit('roomLeft', {
            roomId,
            message: `You have left room ${roomId}`,
        });
        console.log(`Socket ${socket.id} left room ${roomId}`);
    }
    handleTyping(socket, payload) {
        const userId = socket.data.user?.id;
        if (!userId)
            return;
        socket
            .to(payload.roomId)
            .emit('typing', { userId, isTyping: payload.isTyping });
    }
    async loadMoreMessages(socket, payload) {
        const userId = socket.data.user?.id;
        if (!userId)
            return;
        const messages = await this.chatService.loadMessages(payload.roomId, new Date(payload.before));
        socket.emit('moreMessages', messages);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getOnlineFriends'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getOnlineFriends", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('readMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "messageSeen", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "leaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('loadMoreMessages'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "loadMoreMessages", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: process.env.FRONTEND || '*' },
        transports: ['websocket'],
    }),
    (0, common_1.UseFilters)(new ws_exception_1.WsExceptionFilter()),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        chat_service_1.ChatService,
        logger_service_1.LogService,
        myconfig_service_1.ConfigVal,
        auth_service_1.AuthService])
], ChatGateway);
//# sourceMappingURL=chat.gatway.js.map