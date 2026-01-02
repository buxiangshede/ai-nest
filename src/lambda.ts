import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer, proxy } from 'aws-serverless-express';
import type { Handler } from 'aws-lambda';

let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  return createServer(app.getHttpAdapter().getInstance());
}

export const handler: Handler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
