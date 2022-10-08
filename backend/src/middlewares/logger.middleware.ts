import morgan, { StreamOptions } from 'morgan';
import logger from '@/utils/logger';

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

const stream: StreamOptions = {
  write: (message: string) => logger.http(message.trim()),
};

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream,
    skip,
  },
);

export default morganMiddleware;
