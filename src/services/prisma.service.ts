import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
    // 建立数据库连接，等价于 client.$connect()
    await this.$connect();
  }

  async onModuleDestroy() {
    // 应用关闭时释放连接，避免连接泄漏
    await this.$disconnect();
  }
}
