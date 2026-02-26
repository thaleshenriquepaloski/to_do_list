import { Request, Response } from 'express';
import TarefaServices from '../services/TarefaServices.ts';

const tarefaService = new TarefaServices();

class TarefaController {
    async getAllTarefas(req: Request, res: Response) {
        const tarefas = await tarefaService.getAll();
        return res.status(200).json(tarefas);
    };

    async getTarefaById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const tarefa = await tarefaService.getById(id);
        return res.status(200).json(tarefa);
    }

    async createTarefa(req: Request, res: Response) {
        const novaTarefa = await tarefaService.create(req.body);
        return res.status(201).json(novaTarefa);
    };

    async updateTarefa(req: Request, res: Response) {
        const id = Number(req.params.id);
        const tarefaAtualizada = await tarefaService.update(id, req.body);
        return res.status(200).json(tarefaAtualizada);

    };

    async deletarTarefa(req: Request, res: Response) {
        const id = Number(req.params.id);
        const tarefaDeletada = await tarefaService.delete(id);
        if (tarefaDeletada) return res.status(204).send();
    }
}

export default TarefaController;