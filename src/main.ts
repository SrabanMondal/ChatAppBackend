import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigVal } from './core/config/myconfig.service';
//import { Logger } from '@nestjs/common';
import { globalvalidationPipe } from './core/validation/globalvalidations';
import { GlobalException } from './core/filters/globalexception';
import { VersioningType } from '@nestjs/common';
//import { WsClient, WsExceptionFilter } from './core/filters/ws-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //const logger = new Logger('Bootstrap');
  const config = app.get<ConfigVal>(ConfigVal);
  const port = config.getPort();

  app.enableCors({
    origin: config.getNodeEnv() == 'DEV' ? '*' : config.getFrontend(),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    //exposedHeaders: ['Content-Length', 'Content-Type'],
    credentials: true,
  });
  app.useGlobalPipes(globalvalidationPipe(config));
  app.useGlobalFilters(new GlobalException(app.get(HttpAdapterHost)));
  //app.useGlobalFilters(new WsExceptionFilter<WsClient>());
  app.enableShutdownHooks();
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(port ?? 10000);
  console.log(`Server running on port ${port}`);
}
bootstrap()
  .then(() => console.log('Application Started'))
  .catch((err: unknown) => {
    console.error('Application failed to start:', err);
    process.exit(1);
  });
