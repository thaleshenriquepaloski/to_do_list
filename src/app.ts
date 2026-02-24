import e from "express";
import routes from "./routes";

const app = e();
app.use(
    e.json(),
    routes
);

export default app;