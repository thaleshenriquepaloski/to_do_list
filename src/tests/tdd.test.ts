import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import app from '../app.ts';
import db from "../lib/config/dbConnection.ts";

describe('CRUD de tarefas (TO-Do)', () => {

    afterEach(async () => {
        await db.todo.deleteMany({
            where: { description: 'Teste de criar tarefa e atualizada' }
        });
    });

    it('Deve retornar uma lista de tarefas com campos corretos', async () => {
        const tarefas = await request(app).get('/tarefas');

        expect(tarefas.status).toBe(200);
        expect(Array.isArray(tarefas.body)).toBe(true);
        if (tarefas.body.length > 0) {
            expect(tarefas.body[0]).toHaveProperty('description');
            expect(tarefas.body[0]).toHaveProperty('id');
        }
    });

    it('Deve retornar uma tarefa pelo ID', async () => {
        const tarefaBuscada = await criarTarefa();
        const id = Number(tarefaBuscada.id);
        const response = await request(app)
            .get(`/tarefas/${id}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('deadline');
        expect(response.body).toMatchObject({
            id: id,
            description: tarefaBuscada.description,
            priority: tarefaBuscada.priority,
            completed: tarefaBuscada.completed
        });
    });

    it('Deve cadastrar uma nova tarefa', async () => {
        const novaTarefa = {
            description: 'Teste de criar tarefa e atualizada',
            priority: 'Alta',
            deadline: new Date(),
            completed: false
        }

        const response = await request(app)
            .post('/tarefas')
            .send(novaTarefa);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.description).toBe(novaTarefa.description);
    });

    it('Deve atualizar uma tarefa já cadastrada', async () => {
        const tarefa = await criarTarefa();
        const id = Number(tarefa.id);

        const response = await request(app)
            .put(`/tarefas/${id}`)
            .send({ description: 'Teste de criar tarefa e atualizada' });

        expect(response.status).toBe(200);
        expect(response.body.description).toBe('Teste de criar tarefa e atualizada');
    });
})

const criarTarefa = async () => {
    return await db.todo.create({
        data: {
            description: 'Teste de criar tarefa e atualizada',
            priority: 'Baixa',
            deadline: new Date(),
            completed: false
        }
    });
};