import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, Queue } from 'bull';
import { Model } from 'mongoose';
import { RedisService } from 'src/chat/core/redis.service';
import { Message, MessageDocument } from 'src/database/mongo/message.schema';

@Processor('message')
@Injectable()
export class MessageProcessor {
  constructor(
    @InjectQueue() private messagequeue: Queue,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private redisService: RedisService,
  ) {}
  async queueMessage(message: MessageDocument) {
    await this.messagequeue.add(
      'sendMessage',
      { message },
      { attempts: 3, backoff: 5000 },
    );
  }
  @Process('sendMessage')
  async sendMessage(job: Job<{ message: MessageDocument }>) {
    try {
      const message = job.data.message;
      await this.messageModel.create(message);
      //await this.redisService.prefetchMessages(message.roomId.toString());
    } catch (error) {
      throw new InternalServerErrorException('Message send failed' + error);
    }
  }
}
