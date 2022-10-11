export const __prod__ = process.env.NODE_ENV === 'production';
export const RATE_LIMIT_WINDOWMS = 15 * 60 * 1000; // 15 munites
export const RATE_LIMIT_MAX_REQUESTS = 100; // Limit each IP to 100 requests per `window`
