import { Application, oakCors, parse } from './deps.ts';
import logger from './src/middleware/logger.ts';
import timer from './src/middleware/timer.ts';
import error from './src/middleware/error.ts';

import home from './src/routes/home.ts';
import auth from './src/routes/auth.ts';
import user from './src/routes/users.ts';
import bookmark from './src/routes/bookmark.ts';

const argPort = parse(Deno.args).port;
const port = argPort ? Number(argPort) : 8080;
const app = new Application();

if (isNaN(port)) {
  console.log('This is not port number');
}

// Middleware
app.use(logger).use(timer).use(error);

// Disable cors
app.use(oakCors());
// Router
app.use(home.routes()).use(auth.routes()).use(user.routes()).use(bookmark.routes());

console.log(`Application is listing on port: ${port}`);

await app.listen({ port: Number(port) });
