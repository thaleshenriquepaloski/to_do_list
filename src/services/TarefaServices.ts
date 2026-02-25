import db from '../lib/config/dbConnection.ts';

class TarefaServices {
    async getAll() {
        return await db.todo.findMany({
            orderBy: { createdAt: 'desc' }
        })
    };

    async getById(id: number) {
        return await db.todo.findUnique({
            where: { id }
        })
    };

    async create(data: any) {
        const { description, priority, deadline } = data;

        const object: any = {};
        if (description !== undefined) object.description = description;
        if (priority !== undefined) object.priority = priority;
        if (deadline !== undefined) object.deadline = deadline;

        return await db.todo.create({
            data: {
                ...object
            }
        })
    };

    async update(id: number, data: any) {
        const { description, priority, deadline, completed } = data;

        const objetoUpdate: any = {};
        if (description !== undefined) objetoUpdate.description = description;
        if (priority !== undefined) objetoUpdate.priority = priority;
        if (deadline !== undefined) objetoUpdate.deadline = deadline;
        if (completed !== undefined) objetoUpdate.completed = completed;

        return await db.todo.update({
            where: { id },
            data: objetoUpdate
        })
    };
}

export default TarefaServices;