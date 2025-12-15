import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from '../controllers/items.controller';
import { ItemsService } from '../services/items.service';

describe('ItemsController', () => {
  let controller: ItemsController;
  const itemsServiceMock = {
    findAll: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    itemsServiceMock.findAll.mockReset();
    itemsServiceMock.create.mockReset();
    itemsServiceMock.remove.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: itemsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
