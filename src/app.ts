import Koa from "koa";
import { userRoutes } from "./controllers/users/users";

const app = new Koa();

app.use(userRoutes);

export { app };
