import { NextFunction, Request, Response, Router } from 'express';
import IController from '@/interfaces/controller.interface';
import UserService from '@/modules/user/user.service';
import ResponseFactory from '@/utils/response';
import authenticated from '@/middlewares/authenticated.middleware';

class UserController implements IController {
  public path = '/user';
  public router = Router();
  private userService = new UserService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`${this.path}/me`, authenticated, this.profile);
  }

  private profile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const user = await this.userService.getOne(req.userId);
      ResponseFactory.success(res, user);
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
