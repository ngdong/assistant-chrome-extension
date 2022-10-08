import { Request, Response, NextFunction } from 'express';
import token from '@/utils/token';
import Token from '@/interfaces/token.interface';
import HttpException from '@/exceptions/http.exception';
import jwt from 'jsonwebtoken';
import { UserRepository } from '@/repositories/user.repository';

async function authenticatedMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return next(new HttpException(401, 'Unauthorised'));
  }

  const accessToken = bearer.split('Bearer ')[1].trim();
  try {
    const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
      accessToken,
    );

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, 'Unauthorised'));
    }
    const userRepository = UserRepository;

    const user = await userRepository.findOneBy({ id: +payload.id });

    if (!user) {
      return next(new HttpException(401, 'Unauthorised'));
    }

    req.userId = Number(user.id);

    return next();
  } catch (error) {
    return next(new HttpException(401, 'Unauthorised'));
  }
}

export default authenticatedMiddleware;
