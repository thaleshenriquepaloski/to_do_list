import db from '../lib/config/dbConnection.ts';
import { AppError } from '../erros/AppError.ts';

class TarefaServices {

    async create(dto: any) {
        const { description, priority, deadline, userId } = dto;

        if (!description) throw new AppError('O campo de descrição é obrigatório.', 400);
        if (!priority) throw new AppError('O campo prioridade é obrigatório.', 400);
        if (!deadline) throw new AppError('O prazo de entrega é obrigatório', 400);
        if (!userId) throw new AppError('O id do usuário não foi fornecido');

        const novaTarefa = await db.todo.create({
            data: {
                description,
                priority,
                deadline: new Date(deadline),
                userId
            }
        });
        return novaTarefa;
    };

    async getAll(dto: any) {
        const listaTarefas = await db.todo.findMany({
            where: {
                userId: dto.userId
            },
            orderBy: { deadline: 'asc' }
        });
        if (listaTarefas.length === 0) throw new AppError('Nenhuma tarefa encontrada', 404)
        return listaTarefas
    };

    async getById(dto: any) {
        const tarefa = await db.todo.findFirst({
            where: { 
                id: dto.id,
                userId: dto.userId
            }
        });
        if (!tarefa) throw new AppError('Tarefa não encontrada', 404);
        return tarefa;
    };

    async update(dto: any) {
        const { description, priority, deadline, completed } = dto;
        const objetoUpdate: any = {};
        const tarefaExiste = await db.todo.findFirst({
            where: {
                id: dto.id,
                userId: dto.userId
            }
        });
        if (!tarefaExiste) throw new AppError('Tarefa não encontrada', 404);

        if (description !== undefined) {
            if (typeof description === 'string' && description.trim() === '') {
                throw new AppError('A descrição não pode ser vazia');
            }
            objetoUpdate.description = description;
        }

        if (priority !== undefined) {
            if (typeof priority === 'string' && priority.trim() === '') {
                throw new AppError('A prioridade não pode ser vazia', 400);
            }
            objetoUpdate.priority = priority;
        }

        if (deadline !== undefined) {
            if (!deadline) throw new AppError('O prazo não pode ser vazio', 400);
            objetoUpdate.deadline = new Date(deadline);
        }

        if (completed !== undefined) {
            objetoUpdate.completed = !!completed;
        }

        if (Object.keys(objetoUpdate).length === 0) {
            throw new AppError('Nenhum dado válido para atualização foi fornecido', 400);
        }

        return await db.todo.update({
            where: { id: tarefaExiste.id },
            data: objetoUpdate
        });

    };

    async delete(dto: any) {
        const tarefa = await db.todo.findFirst({
            where: {
                id: dto.id,
                userId: dto.userId,
            }
        });

        if (!tarefa) throw new AppError('Tarefa não encontrada', 404);

        return await db.todo.delete({
            where: { id: tarefa.id }
        });
    };
}

export default TarefaServices;