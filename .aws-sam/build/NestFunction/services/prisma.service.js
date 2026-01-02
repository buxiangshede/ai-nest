"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prepare_database_url_1 = require("./prepare-database-url");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await (0, prepare_database_url_1.prepareDatabaseUrl)();
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
            }
            catch (error) {
                console.warn('Prisma connect target parse failed', {
                    error: error instanceof Error ? error.message : error,
                });
            }
        }
        else {
            console.warn('DATABASE_URL missing before Prisma connect');
        }
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map