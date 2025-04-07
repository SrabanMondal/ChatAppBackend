import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigVal } from './myconfig.service';
import * as Joi from 'joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        SQL_URI: Joi.string().uri().required(),
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string().valid('DEV', 'PROD').default('DEV'),
        FRONTEND: Joi.string().required(),
        JWT: Joi.string().required(),
        EMAIL_PASS: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        //SESSION_SECRET: Joi.string().required(),
        //REDIS_URL: Joi.string().uri().required(),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PASS: Joi.string().required(),
        MONGO_URI: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: false,
      },
      cache: true,
    }),
  ],
  providers: [ConfigVal],
  exports: [ConfigVal],
})
export class MyConfig {}
