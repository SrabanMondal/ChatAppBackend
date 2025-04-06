import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//import { Connection } from 'mongoose';
import { MyConfig } from 'src/core/config/myconfig.module';
import { ConfigVal } from 'src/core/config/myconfig.service';
import { MyLogger } from 'src/core/logger/logger.module';
import { LogService } from 'src/core/logger/logger.service';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [MyConfig, MyLogger],
      inject: [ConfigVal, LogService],
      useFactory: (config: ConfigVal) => ({
        uri: config.getMongoUri(),
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class MyMongo {}
