import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prepareDatabaseUrl } from './prepare-database-url';

/**
 * PrismaService 继承 PrismaClient：
 * - Nest 会把它当作可注入的 Provider
 * - 实现 OnModuleInit/Destroy 可以在应用启动和关闭时自动连/断数据库
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await prepareDatabaseUrl();
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      try {
        const url = new URL(databaseUrl);
        console.log('Prisma connect target', {
          host: url.hostname,
          port: url.port || '5432',
          database: url.pathname.replace(/^\//, ''),
          sslmode: url.searchParams.get('sslmode'),
        });
      } catch (error) {
        console.warn('Prisma connect target parse failed', {
          error: error instanceof Error ? error.message : error,
        });
      }
    } else {
      console.warn('DATABASE_URL missing before Prisma connect');
    }
    // 建立数据库连接，等价于 client.$connect()
    await this.$connect();
  }

  async onModuleDestroy() {
    // 应用关闭时释放连接，避免连接泄漏
    await this.$disconnect();
  }
}
