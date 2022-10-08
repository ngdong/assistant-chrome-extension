import fs from 'fs';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir = 'logs';

// Create  the log directory if it does not exist.
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: `${logDir}/%DATE%-combine.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'debug',
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.Console({
      level: 'debug',
    }),
    dailyRotateFileTransport,
  ],
});

export default logger;
