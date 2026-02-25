import { Router } from "express";
import TarefaController from "../controllers/TarefaController.ts";

const tarefaController = new TarefaController();

const routes = Router();

routes
    .get('/tarefas', tarefaController.getAllTarefas)
    .get('/tarefas/:id', tarefaController.getTarefaById)
    .post('/tarefas', tarefaController.createTarefa)
    .put('/tarefas/:id', tarefaController.updateTarefa)
    .delete('/tarefas/:id', tarefaController.deletarTarefa)

export default routes;