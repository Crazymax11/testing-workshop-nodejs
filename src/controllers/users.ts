import Router from "koa-router";
import axios from "axios";
import { userService } from "../services/users";
import Application from "koa";

const router = new Router();

router.get("/users/:id", checkIsShortIsBoolean, async (ctx) => {
  const id = ctx.params.id;
  const { isShort } = ctx.query;

  const { status, data } = await userService.getUser(id, isShort === "true");

  ctx.status = status;
  ctx.body = data;
});

router.get("/users", checkIsShortIsBoolean, async (ctx) => {
  const { isShort } = ctx.query;

  const { status, data } = await userService.getUsers(isShort === "true");

  ctx.status = status;
  ctx.body = data;
});

function checkIsShortIsBoolean(
  ctx: Application.ParameterizedContext<
    any,
    Router.IRouterParamContext<any, {}>
  >,
  next: Application.Next
) {
  const { isShort } = ctx.query;

  if (
    typeof isShort === "string" &&
    isShort !== "true" &&
    isShort !== "false"
  ) {
    ctx.status = 400;
    ctx.body = {
      code: "isShortIsNotBoolean",
      message: "isShort должен быть булевым значением",
    };
    return;
  }

  return next();
}

export const userRoutes = router.routes();
