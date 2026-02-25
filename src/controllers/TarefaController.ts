import { Request, Response } from 'express';
import TarefaServices from '../services/TarefaServices.ts';

const tarefaService = new TarefaServices();

class TarefaController {
    async getAllTarefas(req: Request, res: Response) {
        try {
            const tarefas = await tarefaService.getAll();
            if (tarefas.length === 0) {
                return res.status(404).json({ message: 'Nenhuma tarefa foi encontrada' });
            }
            return res.status(200).json(tarefas);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    };

    async getTarefaById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const tarefa = await tarefaService.getById(id);
            return res.status(200).json(tarefa);
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ message: err.message });
        }
    }

    async createTarefa(req: Request, res: Response) {
        try {
            const novaTarefa = await tarefaService.create(req.body);
            return res.status(201).json(novaTarefa);
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ message: err.message });
        }
    };

    async updateTarefa(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const tarefaAtualizada = await tarefaService.update(id, req.body);
            return res.status(200).json(tarefaAtualizada);
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ message: err.message });
        }
    };

    async deletarTarefa(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const tarefaDeletada = await tarefaService.delete(id);
            if (tarefaDeletada) return res.status(204).send();
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({ message: err.message });
        }
    }
}

export default TarefaController;