import { isCelebrateError } from 'celebrate';
import { NextFunction, Request, Response } from 'express';
import logger from '@/utils/logger';
import ResponseFactory from '@/utils/response';
import { __prod__ } from '@/constants';
import HttpException from '@/exceptions/http.exception';

export const errorMiddleware = (
  error: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  logger.error(error.stack);
  if (typeof error === 'string') {
    return ResponseFactory.error(res, { message: error });
  } else if (isCelebrateError(error)) {
    return ResponseFactory.error(res, {
      message: 'Invalid request data. Please review request and try again.',
      errors: Array.from(error.details).map(([_, { details }]) => ({
        message: details[0].message.replace(/['"]/g, ''),
        field: details[0].path[0] as string,
      })),
    });
  } else if (error.name === 'Error') {
    return ResponseFactory.error(res, {
      message: error.message,
    });
  } else if (error.name === 'HttpException') {
    return ResponseFactory.error(
      res,
      {
        message: error.message,
      },
      error.status,
    );
  } else if (error.name === 'ValidationException') {
    return ResponseFactory.error(res, error);
  }
  // Default to 500 server error
  return ResponseFactory.error(
    res,
    {
      message: __prod__ ? 'Sorry, something went wrong!' : error.message,
    },
    500,
  );
};

export const notFoundHandle = (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  return ResponseFactory.error(
    res,
    {
      message: 'Page Not Found',
    },
    404,
  );
};
