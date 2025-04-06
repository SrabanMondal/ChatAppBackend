import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MyConfig } from '../config/myconfig.module';
import { ConfigVal } from '../config/myconfig.service';
import { EmailModule } from '../email/email.module';
import { EmailProcessor } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/sql/entity/user.entity';
import { UserData, UserDataSchema } from 'src/database/mongo/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from './mongo.service';
//import { ChatModule } from 'src/chat/chat.module';
import { Message, MessageSchema } from 'src/database/mongo/message.schema';
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [MyConfig],
      inject: [ConfigVal],
      useFactory: (configVal: ConfigVal) => ({
        redis: {
          host: configVal.getRedisHost(),
          port: configVal.getRedisPort(),
        },
      }),
    }),
    BullModule.registerQueue({ name: 'email' }),
    BullModule.registerQueue({ name: 'mongo' }),
    BullModule.registerQueue({ name: 'message' }),
    MyConfig,
    EmailModule,
    //ChatModule,
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([
      { name: UserData.name, schema: UserDataSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [EmailProcessor, MongoService],
  exports: [EmailProcessor, MongoService],
})
export class MyBull {}
