import { Injectable, LoggerService as NestLogger } from '@nestjs/common';
import * as winston from 'winston';
import { ConfigVal } from '../config/myconfig.service';
import * as DailyRotateFile from 'winston-daily-rotate-file';
@Injectable()
export class LogService implements NestLogger {
  private logger: winston.Logger;
  constructor(config: ConfigVal) {
    this.logger = winston.createLogger({
      level: config.getNodeEnv() == 'DEV' ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        //winston.format.colorize(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          filename: 'logs/test_backend-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          //zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
        }),
      ],
    });
  }
  log(message: string) {
    this.logger.info(message);
  }
  error(message: string, trace?: string) {
    this.logger.error(message, { trace });
  }
  warn(message: string) {
    this.logger.warn(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
  verbose(message: string) {
    this.logger.verbose(message);
  }
}
