import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from '../services/items.service';
import { PrismaService } from '../services/prisma.service';

describe('ItemsService', () => {
  let service: ItemsService;
  let prisma: PrismaService;

  const prismaMemberMock = {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  const prismaMock = {
    member: prismaMemberMock,
  } as unknown as PrismaService;

  beforeEach(async () => {
    Object.values(prismaMemberMock).forEach((fn) => fn.mockReset());

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });
});
