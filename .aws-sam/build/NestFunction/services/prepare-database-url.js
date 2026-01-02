"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareDatabaseUrl = prepareDatabaseUrl;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const promises_1 = require("node:dns/promises");
const node_net_1 = require("node:net");
const client = new client_secrets_manager_1.SecretsManagerClient({});
let cachedUrl = null;
function sanitizeDatabaseUrl(inputUrl) {
    try {
        const url = new URL(inputUrl);
        if (url.password) {
            url.password = '***';
        }
        return url.toString();
    }
    catch {
        return inputUrl.replace(/\/\/([^:]+):[^@]+@/, '//$1:***@');
    }
}
function logDatabaseUrlDetails(label, inputUrl) {
    try {
        const url = new URL(inputUrl);
        console.log(label, {
            host: url.hostname,
            port: url.port || '5432',
            database: url.pathname.replace(/^\//, ''),
            sslmode: url.searchParams.get('sslmode'),
            connectTimeout: url.searchParams.get('connect_timeout'),
            poolTimeout: url.searchParams.get('pool_timeout'),
            sanitizedUrl: sanitizeDatabaseUrl(inputUrl),
        });
    }
    catch (error) {
        console.log(label, {
            sanitizedUrl: sanitizeDatabaseUrl(inputUrl),
            error: error instanceof Error ? error.message : error,
        });
    }
}
async function prepareDatabaseUrl() {
    if (cachedUrl) {
        return cachedUrl;
    }
    const localUrl = process.env.DATABASE_URL;
    if (localUrl && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
        cachedUrl = localUrl;
        logDatabaseUrlDetails('Database URL source: env (local)', cachedUrl);
        return cachedUrl;
    }
    const secretArn = process.env.DB_SECRET_ARN;
    if (!secretArn) {
        throw new Error('Missing DB_SECRET_ARN environment variable');
    }
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-west-2';
    const secretsHost = `secretsmanager.${region}.amazonaws.com`;
    try {
        const resolved = await (0, promises_1.lookup)(secretsHost);
        console.log('SecretsManager DNS resolved', { host: secretsHost, address: resolved.address });
    }
    catch (error) {
        console.error('SecretsManager DNS lookup failed', {
            host: secretsHost,
            error: error instanceof Error ? error.message : error,
        });
    }
    const command = new client_secrets_manager_1.GetSecretValueCommand({ SecretId: secretArn });
    const response = await client.send(command);
    if (!response.SecretString) {
        throw new Error('SecretString is empty for provided secret');
    }
    const secret = JSON.parse(response.SecretString);
    const url = new URL(`postgresql://${secret.username}:${secret.password}@${secret.host}:${secret.port}/${secret.dbname}`);
    if (!url.searchParams.has('sslmode')) {
        url.searchParams.set('sslmode', 'require');
    }
    if (!url.searchParams.has('connect_timeout')) {
        url.searchParams.set('connect_timeout', '30');
    }
    if (!url.searchParams.has('pool_timeout')) {
        url.searchParams.set('pool_timeout', '30');
    }
    cachedUrl = url.toString();
    process.env.DATABASE_URL = cachedUrl;
    logDatabaseUrlDetails('Database URL source: secretsmanager', cachedUrl);
    logDatabaseUrlDetails('Effective DATABASE_URL', process.env.DATABASE_URL);
    try {
        const dbUrl = new URL(cachedUrl);
        const dbHost = dbUrl.hostname;
        const dbPort = Number(dbUrl.port || '5432');
        const dbName = dbUrl.pathname.replace(/^\//, '');
        const dbResolved = await (0, promises_1.lookup)(dbHost);
        console.log('Database DNS resolved', {
            host: dbHost,
            address: dbResolved.address,
            port: dbPort,
            database: dbName,
        });
        await new Promise((resolve, reject) => {
            const socket = (0, node_net_1.connect)({ host: dbHost, port: dbPort, timeout: 3000 }, () => {
                socket.end();
                resolve(true);
            });
            socket.on('error', (error) => {
                socket.destroy();
                reject(error);
            });
            socket.on('timeout', () => {
                socket.destroy();
                reject(new Error('Database TCP connect timeout'));
            });
        });
        console.log('Database TCP connect succeeded');
    }
    catch (error) {
        console.error('Database connect probe failed', {
            error: error instanceof Error ? error.message : error,
        });
    }
    return cachedUrl;
}
//# sourceMappingURL=prepare-database-url.js.map