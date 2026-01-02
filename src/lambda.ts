import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer, proxy } from 'aws-serverless-express';
import type { Handler } from 'aws-lambda';
import { prepareDatabaseUrl } from './services/prepare-database-url';
console.log('Lambda handler invoked');
let cachedServer: any;

async function bootstrap() {
  await prepareDatabaseUrl();
  const app = await NestFactory.create(AppModule);
  await app.init();
  return createServer(app.getHttpAdapter().getInstance());
}

export const handler: Handler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  console.log('in-----');
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};

// export const handler = () => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ ok: true }),
//   };
// };
