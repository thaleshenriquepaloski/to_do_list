import e from "express";
import router from "./routes/index.ts";
import { errorMiddleware } from "./middlewares/errorMiddleware.ts";

const app = e();

router(app);
app.use(errorMiddleware)

export default app;