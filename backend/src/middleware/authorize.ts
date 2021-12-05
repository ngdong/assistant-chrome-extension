import { Status, verify } from '../../deps.ts';
import { SECRET_KEY } from '../config/config.ts';

export default async (ctx: any, next: any) => {
  const authHeader = ctx.request.headers.get('Authorization');
  if (!authHeader) {
    ctx.throw(Status.Unauthorized, 'Access Token Missing!');
  } else {
    const jwt = authHeader.split(/\s+/)[1];
    const key = SECRET_KEY;
    try {
      const payload = await verify(jwt, key, 'HS256');
      ctx.request.user = payload;
      await next();
    } catch (error) {
      ctx.throw(Status.Unauthorized);
    }
  }
};
