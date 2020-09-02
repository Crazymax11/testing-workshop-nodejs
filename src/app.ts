import Koa from "koa";
import { userRoutes } from "./controllers/users";

const app = new Koa();

app.use(userRoutes);

export { app };
