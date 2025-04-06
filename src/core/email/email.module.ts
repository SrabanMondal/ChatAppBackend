import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MyConfig } from '../config/myconfig.module';

@Module({
  imports: [MyConfig],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
