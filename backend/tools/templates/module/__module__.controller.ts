import { celebrate } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import IController from '@/interfaces/controller.interface';
import __module__Service from '@/modules/__module__(lowerCase)/__module__(lowerCase).service';
import ApplicationResponse from '@/utils/response';

class __module__Controller implements IController {
  public path = '/__module__(lowerCase)s';
  public router = Router();
  private __module__(lowerCase)Service = new __module__Service();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
  }

 
}

export default __module__Controller;
