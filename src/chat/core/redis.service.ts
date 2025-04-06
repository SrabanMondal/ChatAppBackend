import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createClient } from 'redis';
import { Message, MessageDocument } from 'src/database/mongo/message.schema';

@Injectable()
export class RedisService {
  private client: ReturnType<typeof createClient>;
  constructor(
    @InjectModel(Message.name) private messagemodel: Model<MessageDocument>,
  ) {
    this.client = createClient({
      url: 'redis://localhost:6379',
    });
    this.client
      .connect()
      .then(() => console.log('Redis Connected'))
      .catch(() => console.log('Error Connect'));
  }
  async setUserStatus(userId: number, status: 'online' | 'offline') {
    await this.client.set(`user:status:${userId}`, status, { EX: 3600 });
  }
  async getUserStatus(userId: number): Promise<'online' | 'offline'> {
    try {
      const status = await this.client.get(`user:status:${userId}`);
      return status as 'online' | 'offline';
    } catch (error) {
      console.error('No user exists:', error);
      return 'offline';
    }
  }
  async cacheMessages(roomId: string, messages: MessageDocument[]) {
    await this.client.set(roomId, JSON.stringify(messages), { EX: 3600 });
  }
  async getCachedMessages(roomId: string): Promise<MessageDocument[] | null> {
    const cachedMessages = await this.client.get(roomId);
    return cachedMessages
      ? (JSON.parse(cachedMessages) as MessageDocument[])
      : null;
  }
  async setSeenMessages(roomId: string, recieverId: number) {
    const messages = await this.client.get(roomId);
    if (!messages) return;
    const msgs = JSON.parse(messages) as MessageDocument[];
    msgs.map((message) => {
      if (message.senderId == recieverId) {
        message.status = 'seen';
      }
    });
    await this.client.set(roomId, JSON.stringify(msgs), { EX: 3600 });
  }
  async getUserStatuses(
    userIds: number[],
  ): Promise<('online' | 'offline' | null)[]> {
    try {
      const keys = userIds.map((id) => `user:status:${id}`);
      console.log('Redis mGet Keys:', keys);
      const statuses = await this.client.mGet(keys);
      return statuses as ('online' | 'offline' | null)[];
    } catch (error) {
      throw new InternalServerErrorException(
        'Could not get statuses' + String(error),
      );
    }
  }
}
