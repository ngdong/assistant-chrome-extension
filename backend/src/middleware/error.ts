import { isHttpError, Status, Context } from "../../deps.ts";

export default async (ctx: Context, next: any) => {
  try {
    await next();

    const status = ctx.response.status || Status.NotFound;
    if (status === Status.NotFound) {
      ctx.throw(Status.NotFound, "Not Found");
    }
  } catch (error) {
    if (isHttpError(error)) {
      const status = error.status;

      ctx.response.status = status;
      ctx.response.type = "json";
      ctx.response.body = {
        status: status >= 400 && status < 500 ? "fail" : "error",
        msg: error.message,
      };
    }
  }
};
