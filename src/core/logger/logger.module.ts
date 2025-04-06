import { Module } from '@nestjs/common';
import { MyConfig } from '../config/myconfig.module';
import { LogService } from './logger.service';

@Module({
  imports: [MyConfig],
  providers: [LogService],
  exports: [LogService],
})
export class MyLogger {}
