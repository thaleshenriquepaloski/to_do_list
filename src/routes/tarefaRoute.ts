import { Router } from "express";
import TarefaController from "../controllers/TarefaController.ts";

const tarefaController = new TarefaController();

const routes = Router();

routes
    .get('/pegar', tarefaController.getAllTarefas)
    .get('/pegar/:id', tarefaController.getTarefaById)
    .post('/cadastrar', tarefaController.createTarefa)
    .patch('/atualizar/:id', tarefaController.updateTarefa)
    .delete('/deletar/:id', tarefaController.deletarTarefa)

export default routes;