import { Logger as TypeOrmLogger } from 'typeorm';
import logger from '@/utils/logger';

class DatabaseLogger implements TypeOrmLogger {
  logQuery(query: string, parameters?: unknown[]) {
    logger.info(
      `[SQL] ${query} -- Parameters: ${this.stringifyParameters(parameters)}`,
    );
  }

  logQueryError(error: string, query: string, parameters?: unknown[]) {
    logger.error(
      `[SQL] ${query} -- Parameters: ${this.stringifyParameters(
        parameters,
      )} -- ${error}`,
    );
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    logger.warn(
      `[SQL] Time: ${time} -- Parameters: ${this.stringifyParameters(
        parameters,
      )} -- ${query}`,
    );
  }

  logMigration(message: string) {
    logger.info(`[SQL] ${message}`);
  }

  logSchemaBuild(message: string) {
    logger.info(`[SQL] ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: string) {
    if (level === 'log') {
      return logger.info(`[SQL] ${message}`);
    }
    if (level === 'info') {
      return logger.debug(`[SQL] ${message}`);
    }
    if (level === 'warn') {
      return logger.warn(`[SQL] ${message}`);
    }
  }

  private stringifyParameters(parameters?: unknown[]) {
    try {
      return JSON.stringify(parameters);
    } catch {
      return '';
    }
  }
}

export default DatabaseLogger;
