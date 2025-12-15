import { Injectable, NotFoundException } from '@nestjs/common';
import { Member } from '@prisma/client';
import { PrismaService } from './prisma.service';

// Item 类型直接复用 Prisma 生成的 Member 模型，避免重复定义字段
export type Item = Member;

// DTO：控制器把请求体映射成这个对象，再交给服务层
export interface CreateItemPayload {
  name: string;
  email: string;
  role: string;
}

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  // 读取全部成员，Prisma 会把 SQL 查询的 Promise 返回给我们
  findAll(): Promise<Member[]> {
    return this.prisma.member.findMany({ orderBy: { id: 'asc' } });
  }

  // 创建成员 = 向 Supabase 的 members 表插入一条记录
  create(payload: CreateItemPayload): Promise<Member> {
    return this.prisma.member.create({ data: payload });
  }

  // 删除成员：若记录不存在，Prisma 会抛错，这里转换成 404
  async remove(id: number): Promise<void> {
    try {
      await this.prisma.member.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`成员 ${id} 不存在`);
    }
  }
}
