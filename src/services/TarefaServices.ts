import db from '../lib/config/dbConnection.ts';
import { AppError } from '../erros/AppError.ts';

class TarefaServices {
    async getAll() {
        return await db.todo.findMany({
            orderBy: { deadline: 'asc' }
        })
    };

    async getById(id: number) {
        const tarefa = await db.todo.findUnique({
            where: { id }
        })
        if (!tarefa) throw new AppError('Tarefa não encontrada', 404);
        return tarefa;
    };

    async create(data: any) {
        const { description, priority, deadline } = data;

        if (!description) throw new AppError('O campo de descrição é obrigatório.', 400);
        if (!priority) throw new AppError('O campo prioridade é obrigatório.', 400);
        if (!deadline) throw new AppError('O prazo de entrega é obrigatório', 400);

        return await db.todo.create({
            data: {
                description,
                priority,
                deadline: new Date(deadline)
            }
        })
    };

    async update(id: number, data: any) {
        const { description, priority, deadline, completed } = data;

        const objetoUpdate: any = {};

        if (!description) throw new AppError('A descrição é obrigatória')
        objetoUpdate.description = description
        if (!priority) throw new AppError('A prioridade é obrigatória')
        objetoUpdate.priority = priority;
        if (!deadline) throw new AppError('O prazo é obrigatório')
        objetoUpdate.deadline = deadline;

        return await db.todo.update({
            where: { id },
            data: objetoUpdate
        })
    };

    async delete(id: number) {
        const tarefa = await db.todo.findUnique({
            where: { id }
        });

        if (!tarefa) throw new AppError('Tarefa não encontrada', 404);

        return await db.todo.delete({
            where: { id }
        });
    };
}

export default TarefaServices;