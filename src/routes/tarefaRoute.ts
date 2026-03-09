import { Router } from "express";
import TarefaController from "../controllers/TarefaController.ts";
import verificaAutenticacao from "../middlewares/auteticado.ts";

const tarefaController = new TarefaController();

const routes = Router();

routes
    .get('/pegar', verificaAutenticacao, tarefaController.getAllTarefas)
    .get('/pegar/:id', verificaAutenticacao, tarefaController.getTarefaById)
    .post('/cadastrar', verificaAutenticacao, tarefaController.createTarefa)
    .patch('/atualizar/:id', verificaAutenticacao, tarefaController.updateTarefa)
    .delete('/deletar/:id', verificaAutenticacao, tarefaController.deletarTarefa)

export default routes;