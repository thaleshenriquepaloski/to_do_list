import { Request, Response } from 'express';
import db from '../lib/config/dbConnection.ts';

class TarefaController {
    async getAllTarefas(req: Request, res: Response) {
        try {
            const tarefas = await db.todo.findMany();
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
            const tarefa = await db.todo.findUnique({
                where: { id }
            })
            if (!tarefa) return res.status(404).json({ message: 'Tarefa não encontrada' });
            return res.status(200).json(tarefa)
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    async createTarefa(req: Request, res: Response) {
        try {
            const { description, priority, deadline } = req.body;

            const novaTarefa = await db.todo.create({
                data: {
                    description: description,
                    priority: priority,
                    deadline: new Date(deadline)
                }
            })

            return res.status(201).json(novaTarefa);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    };

    async updateTarefa(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { description, priority, deadline, completed } = req.body;

            const objetoUpdate: any = {};
            if (description !== undefined) objetoUpdate.description = description;
            if (priority !== undefined) objetoUpdate.priority = priority;
            if (deadline !== undefined) objetoUpdate.deadline = deadline;
            if (completed !== undefined) objetoUpdate.completed = completed;

            const tarefaAtualizada = await db.todo.update({
                where: { id },
                data: objetoUpdate
            });

            return res.status(200).json(tarefaAtualizada);
        } catch (err: any) {
            console.error(err.message)
            return res.status(500).json({ message: err.message });
        }
    }
}

export default TarefaController;