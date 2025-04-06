import { ValidationPipe } from '@nestjs/common';
import { ConfigVal } from '../config/myconfig.service';

export const globalvalidationPipe = (config: ConfigVal) =>
  new ValidationPipe({
    transform: true,
    whitelist: true,
    //forbidNonWhitelisted: true, // Disallow any unknown properties
    validationError: {
      target: config.getNodeEnv() == 'DEV' ? true : false,
      value: config.getNodeEnv() == 'DEV' ? true : false,
    },
  });
