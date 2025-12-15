import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ItemsService } from '../services/items.service';
import type { CreateItemPayload } from '../services/items.service';

// 控制器负责处理 HTTP 层，把路由请求转给服务层
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // GET /items -> 查询成员列表
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  // POST /items -> 新增成员，Form 数据映射成 CreateItemPayload
  @Post()
  create(@Body() body: CreateItemPayload) {
    return this.itemsService.create(body);
  }

  // DELETE /items/:id -> 删除成员，并返回操作成功结果
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.itemsService.remove(id);
    return { success: true };
  }
}
