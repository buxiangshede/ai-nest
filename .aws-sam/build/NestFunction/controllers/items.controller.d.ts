import { ItemsService } from '../services/items.service';
import type { CreateItemPayload } from '../services/items.service';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    findAll(): Promise<{
        name: string;
        id: number;
        email: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(body: CreateItemPayload): Promise<{
        name: string;
        id: number;
        email: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
