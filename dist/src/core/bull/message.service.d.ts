import { Job, Queue } from 'bull';
import { Model } from 'mongoose';
import { RedisService } from 'src/chat/core/redis.service';
import { MessageDocument } from 'src/database/mongo/message.schema';
export declare class MessageProcessor {
    private messagequeue;
    private messageModel;
    private redisService;
    constructor(messagequeue: Queue, messageModel: Model<MessageDocument>, redisService: RedisService);
    queueMessage(message: MessageDocument): Promise<void>;
    sendMessage(job: Job<{
        message: MessageDocument;
    }>): Promise<void>;
}
