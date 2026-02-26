import e from "express";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware.ts";

const app = e();
app.use(e.json());
app.use(routes);
app.use(errorMiddleware);

export default app;