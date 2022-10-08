import { celebrate } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import IController from '@/interfaces/controller.interface';
import BookmarkService from '@/modules/bookmark/bookmark.service';
import ResponseFactory from '@/utils/response';
import authenticated from '@/middlewares/authenticated.middleware';
import validate from '@/modules/bookmark/bookmark.validation';
import { ICreateBookmarkInput } from '@/modules/bookmark/bookmark.interface';
import upload from '@/middlewares/upload.middleware';

class BookmarkController implements IController {
  public path = '/bookmarks';
  public router = Router();
  private bookmarkService = new BookmarkService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`${this.path}`, authenticated, this.getAll);
    this.router.get(
      `${this.path}/children/:parentId`,
      authenticated,
      this.getChildren,
    );
    this.router.post(
      `${this.path}`,
      [celebrate({ body: validate.create }), authenticated],
      this.create,
    );
    this.router.put(
      `${this.path}`,
      [celebrate({ body: validate.update }), authenticated],
      this.update,
    );
    this.router.delete(
      `${this.path}/:bookmarkId`,
      [celebrate({ params: validate.deleteParams }), authenticated],
      this.delete,
    );
    this.router.post(
      `${this.path}/sort`,
      [celebrate({ query: validate.sort }), authenticated],
      this.sort,
    );
    this.router.get(`${this.path}/export`, [authenticated], this.exportData);
    this.router.post(
      `${this.path}/import`,
      [authenticated, upload.single('file')],
      this.importData,
    );
  }

  private getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.bookmarkService.getAll();
      ResponseFactory.success(res, result);
    } catch (e) {
      next(e);
    }
  };

  private getChildren = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const parentId = +req.params.parentId || undefined;
      const result = await this.bookmarkService.getChildren(parentId);
      ResponseFactory.success(res, result);
    } catch (e) {
      next(e);
    }
  };

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const input = req.body as ICreateBookmarkInput;
      const result = await this.bookmarkService.create(input);
      ResponseFactory.success(res, result, 201);
    } catch (e) {
      next(e);
    }
  };

  private update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const bookmark = req.body;
      const result = await this.bookmarkService.update(bookmark);
      ResponseFactory.success(res, result);
    } catch (e) {
      next(e);
    }
  };

  private delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const bookmarkId = +req.params.bookmarkId;
      const result = await this.bookmarkService.delete(bookmarkId);
      ResponseFactory.success(res, result);
    } catch (e) {
      next(e);
    }
  };

  private sort = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { bookmarkId, to } = req.query;
      const result = await this.bookmarkService.sortable(
        Number(bookmarkId),
        Number(to),
      );
      ResponseFactory.success(res, result);
    } catch (e) {
      next(e);
    }
  };

  private exportData = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const csvData = await this.bookmarkService.exportData();
      const fileName = `bookmark-${new Date().getTime()}.csv`;
      ResponseFactory.file(res, {
        fileName,
        type: 'text/csv',
        stream: csvData,
      });
    } catch (e) {
      next(e);
    }
  };

  private importData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.file) {
        throw new Error('Failed to upload file');
      }
      const filePath = req.file.path;
      const result = await this.bookmarkService.importData(filePath);
      ResponseFactory.success(res, result);
    } catch (e) {
      next(e);
    }
  };
}

export default BookmarkController;
