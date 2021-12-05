import type { RouterContext } from '../../deps.ts';
import UserService from '../services/UserService.ts';
import IUser, { IUserInput } from '../entities/IUser.ts';
import User from '../entities/User.ts';

const userService = new UserService();

// @desc    Get all users
// @route   GET /api/v1/user
export const getUsers = async (context: RouterContext) => {
  context.response.body = await userService.getUsers();
};

// @desc    Create new user
// @route   GET /api/v1/user
export const createUser = async (context: RouterContext) => {
  const { request, response } = context;
  if (!request.hasBody) {
    response.status = 404;
    response.body = { msg: 'Invalid user data' };
    return;
  }
  const { value } = await request.body();
  const user: IUserInput = new User(value);
  const userId = await userService.createUser(user);
  response.status = 200;
  response.body = { msg: 'User has been created', userId: userId };
};

// @desc    Update single user
// @route   PUT /api/v1/user
export const updateUser = async (context: RouterContext) => {
  const { request, response, params } = context;
  const userId = await params.userId;
  if (!request.hasBody || !userId) {
    response.status = 404;
    response.body = { msg: 'Invalid user data' };
    return;
  }
  const { value } = await request.body();
  const user: IUserInput = new User(value);
  const updateUser = await userService.updateUser(userId, user);
  if (updateUser) {
    response.status = 200;
    response.body = {
      msg: 'User has been updated',
    };
  } else {
    response.status = 404;
    response.body = {
      msg: 'User not found',
    };
  }
};

// @desc    Delete single user
// @route   DELETE /api/v1/user
export const deleteUser = async (context: RouterContext) => {
  const { response, params } = context;
  const userId = await params.userId;
  if (!userId) {
    response.status = 404;
    response.body = { msg: 'Invalid user data' };
    return;
  }
  const deleteUser = userService.deleteUser(userId);
  if (deleteUser) {
    response.status = 200;
    response.body = {
      msg: 'User has been deleted',
    };
  } else {
    response.status = 404;
    response.body = {
      msg: 'User not found',
    };
  }
};
