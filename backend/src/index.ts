import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import AuthController from '@/modules/auth/auth.controller';
import UserController from '@/modules/user/user.controller';
import WorkitemController from '@/modules/workitem/workitem.controller';
import BookmarkController from '@/modules/bookmark/bookmark.controller';

validateEnv();

const port = Number(process.env.PORT);
const app = new App(
  [
    new AuthController(),
    new UserController(),
    new WorkitemController(),
    new BookmarkController(),
  ],
  port,
);

app.listen();
