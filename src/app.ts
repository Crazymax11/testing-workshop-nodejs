import Koa from "koa";
import Router from "koa-router";
import axios from "axios";
const app = new Koa();

const router = new Router();

router.get("/users/:id", async (ctx) => {
  const id = ctx.params.id;

  const { status, data } = await axios.get(
    "http://jsonplaceholder.typicode.com/users/" + id
  );

  ctx.status = status;
  ctx.body = convertUser(data);
});

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
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

const userRoutes = router.routes();

app.use(userRoutes);

export { app };
