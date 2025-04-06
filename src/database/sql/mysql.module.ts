import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyConfig } from 'src/core/config/myconfig.module';
import { ConfigVal } from 'src/core/config/myconfig.service';
import { AdminSubscriber } from './subscribers/AdminSubscriber';
import { MyLogger } from 'src/core/logger/logger.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [MyConfig],
      inject: [ConfigVal],
      useFactory: (config: ConfigVal) => ({
        type: 'mysql' as const,
        url: config.getSqlUri(),
        //database: 'test',
        entities: [__dirname + '/entity/*.entity.{js,ts}'],
        migrations: [__dirname + '/migrations/*.{js,ts}'],
        synchronize: config.getNodeEnv() == 'DEV' ? true : false,
        logging: config.getNodeEnv() == 'DEV' ? 'all' : false,
        autoLoadEntities: true,
        poolSize: 10,
        subscribers: [AdminSubscriber],
        connectTimeout: 30000,
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),
    MyLogger,
  ],
  providers: [AdminSubscriber],
  //exports: [TypeOrmModule],
})
export class MySqlModule {}
