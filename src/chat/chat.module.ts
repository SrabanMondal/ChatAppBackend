import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './core/chat.gatway';
import { RedisService } from './core/redis.service';
import { MyBull } from 'src/core/bull/bull.module';
import { UserData, UserDataSchema } from 'src/database/mongo/user.schema';
import { Room, RoomSchema } from 'src/database/mongo/room.schema';
import { Message, MessageSchema } from 'src/database/mongo/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MyLogger } from 'src/core/logger/logger.module';
import { MyConfig } from 'src/core/config/myconfig.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserData.name, schema: UserDataSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    MyLogger,
    MyBull,
    MyConfig,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, RedisService],
})
export class ChatModule {}
