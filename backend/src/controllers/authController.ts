import type { RouterContext } from '../../deps.ts';
import AuthService from '../services/AuthService.ts';
import IUser from '../entities/IUser.ts';
import User from '../entities/User.ts';

const authService = new AuthService();

export const register = async (context: RouterContext) => {
  const { request, response } = context;
  if (!request.hasBody) {
    response.status = 500;
    response.body = { msg: 'Invalid user data' };
    return;
  }
  const result = request.body({ type: 'json' });
  const value = await result.value; // an object of parsed JSON
  const user: IUser = new User(value);
  await authService.register(user);
  response.body = 'User has been created';
};

export const login = async (context: RouterContext) => {
  const { request, response } = context;
  if (!request.hasBody) {
    response.status = 500;
    response.body = { msg: 'Invalid user data' };
    return;
  }
  const result = request.body({ type: 'json' });
  const value = await result.value; // an object of parsed JSON
  const user: IUser = new User(value);
  const { isAuth, token } = await authService.login(user);
  const email = user.email;
  if (!isAuth) {
    response.status = 500;
    response.body = { msg: 'Entered value input is wrong' };
    return;
  }
  response.status = 200;
  response.body = {
    msg: 'Hello user',
    email: email,
    token: token,
  };
};
