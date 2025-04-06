import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyConfig } from './core/config/myconfig.module';
import { MyLogger } from './core/logger/logger.module';
import { LogService } from './core/logger/logger.service';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import { MySqlModule } from './database/sql/mysql.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { MyScheduler } from './core/scheduler/scheduler.module';
import { MyMongo } from './database/mongo/mongo.module';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    MyConfig,
    MyLogger,
    MyScheduler,
    UserModule,
    ChatModule,
    AuthModule,
    MyMongo,
    MySqlModule,
    ThrottlerModule.forRoot({ throttlers: [{ limit: 10, ttl: 60000 }] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly logger: LogService,
    @Inject(getDataSourceToken()) private datasource: DataSource,
    @InjectConnection() private connection: Connection,
  ) {}
  async onModuleInit() {
    try {
      await this.datasource.query('SELECT 1');
      this.logger.log('Connected to the database successfully');
      const mongoStatus = this.connection.readyState;
      if (mongoStatus === ConnectionStates.connected) {
        this.logger.log('MongoDB connected (readyState: 1)');
      } else if (mongoStatus === ConnectionStates.disconnected) {
        this.logger.error('MongoDB disconnected (readyState: 0)');
      } else if (mongoStatus === ConnectionStates.connecting) {
        this.logger.warn('MongoDB connecting (readyState: 2)');
      } else if (mongoStatus === ConnectionStates.disconnecting) {
        this.logger.warn('MongoDB disconnecting (readyState: 3)');
      }
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        this.logger.error(
          'Failed to connect to the database (QueryFailed)',
          error.message,
        );
      } else if (error instanceof Error) {
        this.logger.error(
          'Failed to connect to the database',
          error.stack || error.message,
        );
      } else {
        this.logger.error(
          'Unexpected failure while connecting to database',
          String(error),
        );
      }
    }
  }
}
