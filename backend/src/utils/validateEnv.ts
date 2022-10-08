import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production'],
    }),
    DB_TYPE: str(),
    DB_HOST: str(),
    DB_PORT: str(),
    DB_USERNAME: str(),
    DB_PASSWORD: str(),
    DB_INSTANCE: str(),
    DB_SYNCHRONIZE: str(),
    JWT_SECRET: str(),
    LOG_LEVEL: str(),
    PORT: port({ default: 3000 }),
  });
}

export default validateEnv;
