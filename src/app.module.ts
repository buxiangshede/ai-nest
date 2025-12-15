import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './modules/items.module';
import { PrismaModule } from './modules/prisma.module';

@Module({
  imports: [
    // 把 public 目录作为静态资源根路径，用于前端表格页面
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // 让 Prisma 服务可被项目中的所有模块共享
    PrismaModule,
    // 业务模块：包含 items 的 controller & service
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
