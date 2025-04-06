import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MyLogger } from '../logger/logger.module';
import { DatabaseCleaning } from './scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/sql/entity/user.entity';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    MyLogger,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [DatabaseCleaning],
  exports: [DatabaseCleaning],
})
export class MyScheduler {}
