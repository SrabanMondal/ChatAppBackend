import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from './chat.types';
import { RedisService } from './redis.service';
import { Message, MessageDocument } from 'src/database/mongo/message.schema';
import { ChatService } from '../chat.service';
import { LogService } from 'src/core/logger/logger.service';
import { ConfigVal } from 'src/core/config/myconfig.service';
import { AuthService } from 'src/core/auth/auth.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private redisService;
    private chatService;
    private readonly logger;
    private configservice;
    private authService;
    server: Server;
    constructor(redisService: RedisService, chatService: ChatService, logger: LogService, configservice: ConfigVal, authService: AuthService);
    afterInit(): Promise<void>;
    handleConnection(socket: AuthenticatedSocket): Promise<void>;
    handleDisconnect(socket: AuthenticatedSocket): void;
    getOnlineFriends(socket: AuthenticatedSocket, payload: {
        userId: number;
    }): Promise<void>;
    joinRoom(socket: AuthenticatedSocket, payload: {
        recieverId: number;
    }): Promise<void>;
    sendMessage(socket: AuthenticatedSocket, payload: {
        message: Message;
        receiverId: number;
    }): Promise<void>;
    messageSeen(socket: AuthenticatedSocket, payload: {
        message: MessageDocument;
    }): Promise<void>;
    leaveRoom(socket: AuthenticatedSocket, payload: {
        roomId: string;
    }): Promise<void>;
    handleTyping(socket: AuthenticatedSocket, payload: {
        roomId: string;
        isTyping: boolean;
    }): void;
    loadMoreMessages(socket: AuthenticatedSocket, payload: {
        roomId: string;
        before: string;
    }): Promise<void>;
}
