import { celebrate } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import IController from '@/interfaces/controller.interface';
import validate from '@/modules/auth/auth.validation';
import AuthService from '@/modules/auth/auth.service';
import { ILoginDto, IRegisterDto } from '@/modules/auth/auth.interface';
import ResponseFactory from '@/utils/response';
import authenticated from '@/middlewares/authenticated.middleware';

class AuthController implements IController {
  public path = '/auth';
  public router = Router();
  private authService = new AuthService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      celebrate({ body: validate.register }),
      this.register,
    );
    this.router.post(
      `${this.path}/login`,
      celebrate({ body: validate.login }),
      this.login,
    );
    this.router.post(`${this.path}/logout`, authenticated, this.logout);
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const registerDto = req.body as IRegisterDto;
      await this.authService.register(registerDto);
      ResponseFactory.success(res, {});
    } catch (error) {
      next(error);
    }
  };

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const loginDto = req.body as ILoginDto;
      const token = await this.authService.login(loginDto);

      ResponseFactory.success(res, { token });
    } catch (error) {
      next(error);
    }
  };

  private logout = async (
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<Response | void> => {
    ResponseFactory.success(res, {});
  };
}
export default AuthController;
