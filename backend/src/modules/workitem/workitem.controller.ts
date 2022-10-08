import { celebrate } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import IController from '@/interfaces/controller.interface';
import WorkitemService from '@/modules/workitem/workitem.service';
import authenticated from '@/middlewares/authenticated.middleware';
import ResponseFactory from '@/utils/response';
import validate from '@/modules/workitem/workitem.validation';
import { ICreateWorkitemDto } from '@/modules/workitem/workitem.interface';

class WorkitemController implements IController {
  public path = '/workitems';
  public router = Router();
  private workitemService = new WorkitemService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`${this.path}`, authenticated, this.getAll);
    this.router.get(
      `${this.path}/:id`,
      [celebrate({ params: validate.getOne }), authenticated],
      this.getOne,
    );
    this.router.get(
      `${this.path}/recentlycreated`,
      authenticated,
      this.recentlyCreated,
    );
    this.router.post(
      `${this.path}`,
      [celebrate({ body: validate.create }), authenticated],
      this.create,
    );
  }

  private getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.workitemService.getAll();
      return ResponseFactory.success(res, result);
    } catch (e) {
      next(e);
    }
  };

  private getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const item = await this.workitemService.getOne(+req.params.id);
      ResponseFactory.success(res, item);
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
      const workItemInput = req.body as ICreateWorkitemDto;
      await this.workitemService.create(workItemInput, req.userId);
      ResponseFactory.success(res, {}, 201);
    } catch (e) {
      next(e);
    }
  };

  private recentlyCreated = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.workitemService.recentlyCreated(req.userId);
      ResponseFactory.success(res, result);
    } catch (e) {
      next(e);
    }
  };
}

export default WorkitemController;
