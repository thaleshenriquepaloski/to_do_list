import { Request, Response } from 'express';
import TarefaServices from '../services/TarefaServices.ts';

const tarefaService = new TarefaServices();

class TarefaController {

    async createTarefa(req: Request, res: Response) {
        const { description, priority, deadline } = req.body;
        const userId = req.user?.id;
        const novaTarefa = await tarefaService.create({ description, priority, deadline, userId });
        return res.status(201).json(novaTarefa);
    };
    
    async getAllTarefas(req: Request, res: Response) {
        const userId = req.user?.id;
        const tarefas = await tarefaService.getAll({ userId });
        return res.status(200).json(tarefas);
    };

    async getTarefaById(req: Request, res: Response) {
        const userId = req.user?.id;
        const id = Number(req.params.id);
        const tarefa = await tarefaService.getById({ userId, id });
        return res.status(200).json(tarefa);
    }

    async updateTarefa(req: Request, res: Response) {
        const userId = req.user?.id;
        const id = Number(req.params.id);
        const { description, priority, deadline } = req.body;
        const tarefaAtualizada = await tarefaService.update({ userId, id, description, priority, deadline });
        return res.status(200).json(tarefaAtualizada);

    };

    async deletarTarefa(req: Request, res: Response) {
        const userId = req.user?.id;
        const id = Number(req.params.id);
        const tarefaDeletada = await tarefaService.delete({userId, id});
        if (tarefaDeletada) return res.status(204).send();
    }
}

export default TarefaController;