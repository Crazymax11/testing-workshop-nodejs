import Router from "koa-router";
import { isValidShort } from "./isValidShort";
import { UserService } from "../../services/users";

const router = new Router();

router.get("/users/:id", isValidShort, async (ctx) => {
  const id = ctx.params.id;
  const { short } = ctx.query;

  const service = new UserService();
  const { status, data } = await service.getUser(id, short === "true");

  ctx.status = status;
  ctx.body = data;
});

router.get("/users", isValidShort, async (ctx) => {
  const { short } = ctx.query;

  const service = new UserService();
  const { status, data } = await service.getUsers(short === "true");

  ctx.status = status;
  ctx.body = data;
});

export const userRoutes = router.routes();
