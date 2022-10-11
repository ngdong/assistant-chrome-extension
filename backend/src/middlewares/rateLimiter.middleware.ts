import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOWMS } from '@/constants';
import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOWMS,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: 'You have exceeded the 100 requests in 15 minutes limit!',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default rateLimiter;
