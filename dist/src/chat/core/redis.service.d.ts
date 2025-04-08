import { Model } from 'mongoose';
import { ConfigVal } from 'src/core/config/myconfig.service';
import { MessageDocument } from 'src/database/mongo/message.schema';
export declare class RedisService {
    private messagemodel;
    private myconfig;
    private client;
    constructor(messagemodel: Model<MessageDocument>, myconfig: ConfigVal);
    setUserStatus(userId: number, status: 'online' | 'offline'): Promise<void>;
    getUserStatus(userId: number): Promise<'online' | 'offline'>;
    cacheMessages(roomId: string, messages: MessageDocument[]): Promise<void>;
    getCachedMessages(roomId: string): Promise<MessageDocument[] | null>;
    setSeenMessages(roomId: string, recieverId: number): Promise<void>;
    getUserStatuses(userIds: number[]): Promise<('online' | 'offline' | null)[]>;
}
