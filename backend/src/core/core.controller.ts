import { NextFunction, Request, Response, Router } from 'express';
import { ObjectLiteral } from 'typeorm';
import ResponseFactory from '@/utils/response';
import CoreService from '@/core/core.service';
import IController from '@/interfaces/controller.interface';

class CoreController<T extends ObjectLiteral> implements IController {
  public path: string;
  public router = Router();
  private entityService: CoreService<T>;

  constructor(service: CoreService<T>, path: string) {
    this.entityService = service;
    this.path = path;
  }

  protected getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.entityService.getAll();
      ResponseFactory.success(res, result);
    } catch (e) {
      next(e);
    }
  };

  protected getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const objId = Number(req.params.id);
      const result = await this.entityService.getOne(objId);
      ResponseFactory.success(res, result);
    } catch (e) {
      next(e);
    }
  };

  protected create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const input = req.body;
      const result = await this.entityService.create(input);
      ResponseFactory.success(res, result, 201);
    } catch (e) {
      next(e);
    }
  };

  protected update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const input = req.body;
      const result = await this.entityService.update(input);
      ResponseFactory.success(res, result);
    } catch (e) {
      next(e);
    }
  };

  protected delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const objId = Number(req.params.id);
      const result = await this.entityService.delete(objId);
      ResponseFactory.success(res, result);
    } catch (e) {
      next(e);
    }
  };
}

export default CoreController;
