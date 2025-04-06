import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyConfig } from './myconfig.interface';

@Injectable()
export class ConfigVal {
  private config: MyConfig;
  constructor(private configService: ConfigService) {
    const sqluri = configService.get<string>('SQL_URI');
    const port = configService.get<number>('PORT');
    const nodeenv = configService.get<'DEV' | 'PROD'>('NODE_ENV');
    const frontend = configService.get<string>('FRONTEND');
    const jwt = configService.get<string>('JWT');
    const user = configService.get<string>('EMAIL_USER');
    const pass = configService.get<string>('EMAIL_PASS');
    const redis_port = configService.get<number>('REDIS_PORT');
    const redis_host = configService.get<string>('REDIS_HOST');
    const mongo_uri = configService.get<string>('MONGO_URI');
    if (!sqluri) {
      throw new BadRequestException('Missing sql URI');
    }
    if (!port) {
      throw new BadRequestException('Missing port');
    }
    if (!nodeenv) {
      throw new BadRequestException('Missing nodenv');
    }
    if (!frontend) {
      throw new BadRequestException('Missing frontend');
    }
    if (!jwt) {
      throw new BadRequestException('Missing JWT');
    }
    if (!user) {
      throw new BadRequestException('Missing email user');
    }
    if (!pass) {
      throw new BadRequestException('Missing email password');
    }
    if (!redis_port) {
      throw new BadRequestException('Missing redis port');
    }
    if (!redis_host) {
      throw new BadRequestException('Missing redis host');
    }
    if (!mongo_uri) {
      throw new BadRequestException('Missing mongo URI');
    }
    this.config = {
      SQL_URI: sqluri,
      PORT: port,
      NODE_ENV: nodeenv,
      FRONTEND: frontend,
      JWT: jwt,
      EMAIL_USER: user,
      EMAIL_PASS: pass,
      REDIS_HOST: redis_host,
      REDIS_PORT: redis_port,
      MONGO_URI: mongo_uri,
    };
  }
  getSqlUri(): string {
    return this.config.SQL_URI;
  }
  getNodeEnv(): 'DEV' | 'PROD' {
    return this.config.NODE_ENV;
  }
  getPort(): number {
    return this.config.PORT;
  }
  getFrontend(): string {
    return this.config.FRONTEND;
  }
  getJwt(): string {
    return this.config.JWT;
  }
  getUser(): string {
    return this.config.EMAIL_USER;
  }
  getPass(): string {
    return this.config.EMAIL_PASS;
  }
  getRedisHost(): string {
    return this.config.REDIS_HOST;
  }
  getRedisPort(): number {
    return this.config.REDIS_PORT;
  }
  getMongoUri(): string {
    return this.config.MONGO_URI;
  }
  getRedisUrl(): string {
    return `redis://${this.config.REDIS_HOST}:${this.config.REDIS_PORT}`;
  }
}
