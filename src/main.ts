import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { prepareDatabaseUrl } from './services/prepare-database-url';

async function bootstrap() {
  await prepareDatabaseUrl();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
