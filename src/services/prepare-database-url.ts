import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({});

export async function prepareDatabaseUrl() {
  const secretArn = process.env.DB_SECRET_ARN!;
  const command = new GetSecretValueCommand({ SecretId: secretArn });
  const response = await client.send(command);

  const secret = JSON.parse(response.SecretString!);

  return `postgresql://${secret.username}:${secret.password}@${secret.host}:${secret.port}/${secret.dbname}`;
}
