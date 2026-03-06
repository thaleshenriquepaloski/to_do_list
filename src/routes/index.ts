import e from "express";
import tarefaRouter from './tarefaRoute.ts';
import usuarioRoute from './usuarioRoute.ts';
import authRouter from './authRoute.ts';

const router = (app: e.Application) => {
    app.use(e.json());

    app.use('/auth', authRouter);
    app.use('/usuarios', usuarioRoute);
    app.use('/tarefas', tarefaRouter);
};

export default router;