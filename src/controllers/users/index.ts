import Koa from "koa";
import Router from "koa-router";
import { UsersService } from "../../services/users";

const router = new Router();

router.get("/users/:id", isShortQueryIsValid, async (ctx) => {
  const id = ctx.params.id;

  const { isShort } = ctx.query;
  const service = new UsersService();
  const { status, body } = await service.getUser(id, isShort === "true");

  ctx.status = status;
  ctx.body = body;
});

router.get("/users", async (ctx) => {
  const { isShort } = ctx.query;
  const service = new UsersService();
  const { status, body } = await service.getUsers(isShort === "true");

  ctx.status = status;
  ctx.body = body;
});

function isShortQueryIsValid(
  ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>,
  next: Koa.Next
) {
  const { isShort } = ctx.query;

  if (
    typeof isShort === "string" &&
    isShort !== "true" &&
    isShort !== "false"
  ) {
    ctx.status = 400;
    ctx.body = { code: "IS_SHORT_MUST_BE_BOOL" };
    return;
  }

  return next();
}

export const userRoutes = router.routes();
