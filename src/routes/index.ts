import e from "express";
import tarefaRouter from './tarefaRoute.ts';
import usuarioRoute from './usuarioRoute.ts';

const router = (app) => {
    app.use(
        e.json(),
        tarefaRouter,
        usuarioRoute,
    )
};

export default router;