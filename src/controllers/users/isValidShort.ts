import Koa from "koa";

export function isValidShort(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const { short } = ctx.query;
  if (typeof short === "string" && short !== "true" && short !== "false") {
    ctx.status = 400;
    ctx.body = {
      message: "short должен быть либо true либо false",
    };
    return;
  }

  return next();
}
