"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const aws_serverless_express_1 = require("aws-serverless-express");
const prepare_database_url_1 = require("./services/prepare-database-url");
console.log('Lambda handler invoked');
let cachedServer;
async function bootstrap() {
    await (0, prepare_database_url_1.prepareDatabaseUrl)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.init();
    return (0, aws_serverless_express_1.createServer)(app.getHttpAdapter().getInstance());
}
const handler = async (event, context) => {
    if (!cachedServer) {
        cachedServer = await bootstrap();
    }
    console.log('in-----');
    return (0, aws_serverless_express_1.proxy)(cachedServer, event, context, 'PROMISE').promise;
};
exports.handler = handler;
//# sourceMappingURL=lambda.js.map