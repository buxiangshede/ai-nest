import { Member } from '@prisma/client';
import { PrismaService } from './prisma.service';
export type Item = Member;
export interface CreateItemPayload {
    name: string;
    email: string;
    role: string;
}
export declare class ItemsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Member[]>;
    create(payload: CreateItemPayload): Promise<Member>;
    remove(id: number): Promise<void>;
}
