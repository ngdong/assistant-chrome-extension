import { IGenerateException } from 'interfaces/exception.interface';
import { Response } from 'express';
import IFileResponse from '@/interfaces/response.interface';

export default class ResponseFactory {
  static success<T>(res: Response, data: T, status = 200) {
    res.status(status);
    return res.json({
      status: 'success',
      data: data,
    });
  }

  static successForPaging<T>(
    res: Response,
    data: T,
    totalItems: number,
    limit: number,
    status = 200,
  ) {
    res.status(status);
    return res.json({
      status: 'success',
      data,
      limit,
      totalItems,
    });
  }

  static error(res: Response, error: IGenerateException, status = 400) {
    res.status(status);
    return res.json({
      status: 'failed',
      error: {
        message: error.message,
        errors: error.errors,
      },
    });
  }

  static file(res: Response, fileRes: IFileResponse, status = 200) {
    res.status(status);
    res.setHeader('Content-Type', fileRes.type);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileRes.fileName}`,
    );
    return res.end(fileRes.stream);
  }
}
