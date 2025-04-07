import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from './chat.types';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import { UserData } from 'src/database/mongo/user.schema';
import { Message, MessageDocument } from 'src/database/mongo/message.schema';
import { UnauthorizedException } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { LogService } from 'src/core/logger/logger.service';
import { ConfigVal } from 'src/core/config/myconfig.service';
import { AuthService } from 'src/core/auth/auth.service';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND || '*' },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private redisService: RedisService,
    private chatService: ChatService,
    private readonly logger: LogService,
    private configservice: ConfigVal,
    private authService: AuthService,
  ) {
    this.afterInit()
      .then(() => logger.log('Socket connected'))
      .catch(() => logger.log('Socket errror'));
  }
  async afterInit() {
    try {
      const pubClient = createClient({ url: this.configservice.getRedisUrl() });
      const subClient = pubClient.duplicate();
      await Promise.all([pubClient.connect(), subClient.connect()]);
      this.server.adapter(createAdapter(pubClient, subClient));
      this.logger.log('Redis adapter initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Redis adapter', String(error));
      throw new Error('Redis adapter initialization failed');
    }
  }
  async handleConnection(socket: AuthenticatedSocket) {
    //const userId = socket.data.user?.id;
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
        throw new UnauthorizedException('User not exists');
      }
      if (socket.data.disconnectTimeout) {
        clearTimeout(socket.data.disconnectTimeout);
        socket.data.disconnectTimeout = null;
      }
      await socket.join(`user_${userId}`);
      await this.redisService.setUserStatus(userId, 'online');
      const friends = await this.chatService.getFriends(userId);
      if (friends && friends.length > 0) {
        friends.forEach((friend) =>
          this.server.to(`user_${friend.id.toString()}`).emit('userStatus', {
            userId,
            status: 'online',
          }),
        );
      }
    } catch (error) {
      this.logger.debug(String(error));
      socket.disconnect();
    }
  }
  handleDisconnect(@ConnectedSocket() socket: AuthenticatedSocket) {
    const userId = socket.data.user?.id;
    if (socket.data.disconnectTimeout) {
      clearTimeout(socket.data.disconnectTimeout);
      socket.data.disconnectTimeout = null;
    }
    if (!userId) return;
    socket.data.disconnectTimeout = setTimeout(() => {
      (async () => {
        try {
          const sockets = await this.server.in(`user_${userId}`).fetchSockets();
          if (sockets.length === 0) {
            await this.redisService.setUserStatus(userId, 'offline');
            const friends = await this.chatService.getFriends(userId);
            friends.forEach((friend) =>
              this.server
                .to(`user_${friend.id.toString()}`)
                .emit('userStatus', {
                  userId,
                  status: 'offline',
                }),
            );
            this.logger.log(`User ${userId} is offline, notified friends`);
          } else {
            this.logger.log(
              `User ${userId} still has ${sockets.length} active connections`,
            );
          }
        } catch (error) {
          this.logger.error(
            `Disconnect error for user ${userId}:`,
            String(error),
          );
        } finally {
          socket.data.disconnectTimeout = null;
        }
      })().catch((error) => {
        this.logger.error(
          `Uncaught disconnect error for user ${userId}:`,
          String(error),
        );
      });
    }, 5000);
  }
  @SubscribeMessage('getOnlineFriends')
  async getOnlineFriends(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: { userId: number },
  ) {
    const { userId } = payload;
    if (!userId) return;
    const friends = await this.chatService.getFriends(userId);
    const friendIds = friends.map((friend) => friend.id);
    const friendStatuses = await this.redisService.getUserStatuses(friendIds);
    const onlineFriends: UserData[] = friends.filter(
      (friend, index) => friendStatuses[index] === 'online',
    );
    this.server.to(`user_${userId}`).emit('onlineFriends', onlineFriends);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: { recieverId: number },
  ) {
    const userId = socket.data.user?.id;
    if (!userId) return;
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
    const room = await this.chatService.getorCreateRoom(
      roomId,
      userId,
      recieverId,
    );
    await socket.join(roomId);
    this.server
      .to(`user_${userId}`)
      .emit('roomJoined', { roomId, participants: room.participants });
    const messages = await this.redisService.getCachedMessages(roomId);
    if (messages && messages.length > 0) {
      socket.emit('chatHistory', messages);
    } else {
      const messages = await this.chatService.getPastMessages(roomId);
      if (messages && messages.length > 0) {
        await this.redisService.cacheMessages(roomId, messages);
        socket.emit('chatHistory', messages);
      } else {
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

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: { message: Message; receiverId: number },
  ) {
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
      //   message.status = 'delivered';
      socket.to(message.roomId).emit('sendMessage', messagesaved);
    }
    this.logger.log(`User ${userId} sent message to room ${message.roomId}`);
    this.server
      .to(`user_${receiverId}`)
      .emit('newMessageNotification', messagesaved);
    const cachedMessages = await this.redisService.getCachedMessages(
      message.roomId,
    );
    if (cachedMessages) {
      cachedMessages.push(messagesaved);
      await this.redisService.cacheMessages(message.roomId, cachedMessages);
    }
    this.server.to(`user_${userId}`).emit('messageSent', messagesaved);
  }

  @SubscribeMessage('readMessage')
  async messageSeen(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody()
    payload: { message: MessageDocument },
  ) {
    const { message } = payload;
    this.logger.log(
      `User ${message.senderId} has seen message in room ${message.roomId}`,
    );
    await this.redisService.setSeenMessages(message.roomId, message.senderId);
    await this.chatService.readMessage(message);
    this.server.to(`user_${message.senderId}`).emit('messageSeen', message);
  }
  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody()
    payload: { roomId: string },
  ) {
    const { roomId } = payload;
    await socket.leave(roomId);
    socket.emit('roomLeft', {
      roomId,
      message: `You have left room ${roomId}`,
    });

    console.log(`Socket ${socket.id} left room ${roomId}`);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: { roomId: string; isTyping: boolean },
  ) {
    const userId = socket.data.user?.id;
    if (!userId) return;
    socket
      .to(payload.roomId)
      .emit('typing', { userId, isTyping: payload.isTyping });
  }

  @SubscribeMessage('loadMoreMessages')
  async loadMoreMessages(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: { roomId: string; before: string },
  ) {
    const userId = socket.data.user?.id;
    if (!userId) return;
    const messages = await this.chatService.loadMessages(
      payload.roomId,
      new Date(payload.before),
    );
    socket.emit('moreMessages', messages);
  }
}
