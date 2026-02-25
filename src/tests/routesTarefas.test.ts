import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import app from '../app.ts';
import db from "../lib/config/dbConnection.ts";


afterEach(async () => {
    await db.todo.deleteMany({
        where: {
            id: {
                gt: 3
            }
        }
    });
});

describe('GET /tarefas/', () => {

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

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('description');
        expect(response.body).toHaveProperty('priority');
        expect(response.body).toHaveProperty('deadline');
        expect(response.body).toHaveProperty('completed');
    });

    it('Deve retornar um status 404 e mensagem de erro para ID não encontrado', async () => {
        const idInexistente = Number(0)
        const response = await request(app)
            .get(`/tarefas/${idInexistente}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            message: 'Tarefa não encontrada'
        })
    });

});

describe('POST - /tarefas', () => {

    it('Deve cadastrar uma nova tarefa', async () => {
        const novaTarefa = await criarTarefa();

        const response = await request(app)
            .post('/tarefas')
            .send(novaTarefa);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.description).toBe(novaTarefa.description);
    });

    it('Deve retornar erro 400 por faltar descrição', async () => {
        const response = await request(app)
            .post('/tarefas')
            .send({
                //description faltando propositalmente
                priority: 'Alta',
                deadline: '2026-03-02T10:00:00.000Z'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'O campo de descrição é obrigatório.')
    });

    it('Deve retornar erro 400 por faltar priority', async () => {
        const response = await request(app)
            .post('/tarefas')
            .send({
                description: 'Teste',
                // priority faltando o proposiltamente
                deadline: '2026-03-02T10:00:00.000Z'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'O campo prioridade é obrigatório.');
    });

    it('Deve retornar erro 400 por faltar deadline', async () => {
        const response = await request(app)
            .post('/tarefas')
            .send({
                description: 'Teste',
                priority: 'Alta',
                // campo faltando propositalmente
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'O prazo de entrega é obrigatório');
    });
});

describe('PUT - /tarefas/:id', () => {

    it('Deve atualizar uma tarefa já cadastrada', async () => {
        const tarefa = await criarTarefa();
        const id = Number(tarefa.id);

        const response = await request(app)
            .put(`/tarefas/${id}`)
            .send({
                description: 'Teste de criar tarefa e atualizada',
                priority: 'Alta',
                deadline: '2026-10-10T10:00:00.000Z'
            });

        expect(response.status).toBe(200);
        expect(response.body.description).toBe('Teste de criar tarefa e atualizada');
    });

    const cenariosErros = [
        { campo: 'description', dados: { description: '', priority: 'Alta', deadline: '2026-10-10T10:00:00.000Z' }, message: 'A descrição é obrigatória' },
        { campo: 'priority', dados: { description: 'Tarefa atualizada', priority: '', deadline: '2026-10-10T10:00:00.000Z' }, message: 'A prioridade é obrigatória' },
        { campo: 'deadline', dados: { description: 'Tarefa atualizada', priority: 'Alta', deadline: '' }, message: 'O prazo é obrigatório' }
    ];

    cenariosErros.forEach((cenario) => {
        it(`Deve retornar 400 se o campo ${cenario.campo} for vazio`, async () => {
            const tarefa = await criarTarefa();
            const id = Number(tarefa.id);

            const response = await request(app)
                .put(`/tarefas/${id}`)
                .send(cenario.dados);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(cenario.message);
        })
    });

});

describe('DELETE - /tarefas/:id', () => {

    it('Deve excluir uma tarefa criada', async () => {
        const tarefa = await criarTarefa();
        const idDeletar = tarefa.id;

        const response = await request(app)
            .delete(`/tarefas/${idDeletar}`);

        expect(response.status).toBe(204);
    });

    it('Deve retornar status 404 e não excluido por id não encontrado', async () => {
        const idIncorreto = 9999

        const response = await request(app)
            .delete(`/tarefas/${idIncorreto}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Tarefa não encontrada');
    });
});

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