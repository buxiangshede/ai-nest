import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

// 全局模块：让 PrismaService 在任何模块中都能直接注入
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
