import Koa from "koa";
import Router from "koa-router";
import axios, { AxiosError } from "axios";

const app = new Koa();

const router = new Router();
router.get("/users/:id", isValidShort, async (ctx, next) => {
  const id = ctx.params.id;
  const { short } = ctx.query;

  const { status, data } = await getUserService(id, short === "true");

  ctx.status = status;
  ctx.body = data;
});

router.get("/users", isValidShort, async (ctx, next) => {
  const { short } = ctx.query;

  const { status, data } = await getUsersService(short === "true");

  ctx.status = status;
  ctx.body = data;
});

export const routes = router.routes();
app.use(router.routes());

function getUser(userId: string) {
  return axios.get("http://jsonplaceholder.typicode.com/users/" + userId);
}

function getUsers() {
  return axios.get("http://jsonplaceholder.typicode.com/users");
}

async function getUserService(
  userId: string,
  isShort: boolean = false
): Promise<{ status: number; data: any }> {
  const res = await getUser(userId).then(
    (res) => ({
      status: 200,
      data: isShort ? convertToShortUser(res.data) : convertUser(res.data),
    }),
    (error: AxiosError | Error) => {
      if ("response" in error) {
        return {
          status: error.response?.status || 500,
          data: error.response?.data,
        };
      }

      return { status: 500, data: null };
    }
  );
  return res;
}

async function getUsersService(isShort: boolean) {
  const res = await getUsers().then(
    (res) => ({
      status: 200,
      data: isShort
        ? res.data.map(convertToShortUser)
        : res.data.map(convertUser),
    }),
    (error: AxiosError | Error) => {
      if ("response" in error) {
        return {
          status: error.response?.status || 500,
          data: error.response?.data,
        };
      }

      return { status: 500, data: null };
    }
  );
  return res;
}

interface ShortUser {
  id: number;
  name: string;
  email: string;
}
interface User extends ShortUser {
  username: string;
  phone: string;
  website: string;
}

function convertToShortUser(data: any): ShortUser {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
  };
}
function convertUser(data: any): User {
  return {
    id: data.id,
    name: data.name,
    username: data.username,
    email: data.email,
    phone: data.phone,
    website: data.website,
  };
}

function isValidShort(ctx: Koa.ParameterizedContext, next: Koa.Next) {
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

//app.listen(3000);
