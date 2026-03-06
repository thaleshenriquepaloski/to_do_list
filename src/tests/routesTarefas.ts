import { describe, it, expect, afterEach, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from '../app.ts';
import db from "../lib/config/dbConnection.ts";

let idUsuarioParaTeste: string;
beforeEach(async () => {
    await db.todo.deleteMany();

    const novoUser = await db.user.create({
        data: {
            email: 'teste@teste.com',
            password: 'password123',
            name: 'Testador'
        }
    });

    idUsuarioParaTeste = novoUser.id;
});
afterAll(async () => {
    await db.user.deleteMany({
        where: {
            email: 'teste@teste.com'
        }
    });
})

describe('GET /tarefas/buscar', () => {

    it('Deve retornar uma lista de tarefas com campos corretos', async () => {
        const objetoTarefa = objetoCriarTarefa(idUsuarioParaTeste);
        await request(app)
            .post('/tarefas')
            .send(objetoTarefa);

        const response = await request(app)
            .get('/tarefas/buscar')
            .send({ userId: idUsuarioParaTeste });

        expect(response.status).toBe(200);
        if (response.body.length > 0) {
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('description');
        }
    });

    it('Deve retornar uma tarefa pelo ID', async () => {
        const objetoTarefa = objetoCriarTarefa(idUsuarioParaTeste);
        const tarefaBuscada = await request(app)
            .post('/tarefas')
            .send(objetoTarefa);

        const id = Number(tarefaBuscada.body.id);
        const response = await request(app)
            .get(`/tarefas/${id}`)
            .send({ userId: idUsuarioParaTeste })

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
        const objetoTarefa = objetoCriarTarefa(idUsuarioParaTeste);
        const response = await request(app)
            .post('/tarefas')
            .send(objetoTarefa);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.description).toBe(objetoTarefa.description);
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

    it('Deve retornar erro 400 por faltar o id do usuário', async () => {
        const response = await request(app)
            .post('/tarefas')
            .send({
                description: 'Teste',
                priority: 'Alta',
                deadline: '2026-03-02T10:00:00.000Z',
                //faltando userId;
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'O id do usuário não foi fornecido');
    });
});

describe('PUT - /tarefas/:id', () => {

    it('Deve atualizar uma tarefa já cadastrada', async () => {
        const objetoTarefa = objetoCriarTarefa(idUsuarioParaTeste);
        const tarefa = await request(app)
            .post('/tarefas')
            .send(objetoTarefa);
        const id = Number(tarefa.body.id);

        const response = await request(app)
            .patch(`/tarefas/${id}`)
            .send({
                description: 'Teste de criar tarefa e atualizada',
                priority: 'Alta',
                deadline: '2026-10-10T10:00:00.000Z',
                userId: idUsuarioParaTeste
            });

        expect(response.status).toBe(200);
        expect(response.body.description).toBe('Teste de criar tarefa e atualizada');
    });

    const cenariosErros = [
        { campo: 'description', dados: { description: '', priority: 'Alta', deadline: '2026-10-10T10:00:00.000Z', userId: idUsuarioParaTeste }, message: 'A descrição não pode ser vazia' },
        { campo: 'priority', dados: { description: 'Tarefa atualizada', priority: '', deadline: '2026-10-10T10:00:00.000Z', userId: idUsuarioParaTeste }, message: 'A prioridade não pode ser vazia' },
        { campo: 'deadline', dados: { description: 'Tarefa atualizada', priority: 'Alta', deadline: '', userId: idUsuarioParaTeste }, message: 'O prazo não pode ser vazio' }
    ];

    cenariosErros.forEach((cenario) => {
        it(`Deve retornar 400 se o campo ${cenario.campo} for vazio`, async () => {
            const objetoTarefa = objetoCriarTarefa(idUsuarioParaTeste);
            const tarefa = await request(app)
                .post('/tarefas')
                .send(objetoTarefa);

            const idTarefa = Number(tarefa.body.id);

            const response = await request(app)
                .patch(`/tarefas/${idTarefa}`)
                .send(cenario.dados);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(cenario.message);
        })
    });

});

describe('DELETE - /tarefas/:id', () => {

    it('Deve excluir uma tarefa criada', async () => {
        const objetoTarefa = objetoCriarTarefa(idUsuarioParaTeste);
        const tarefa = await request(app)
            .post('/tarefas')
            .send(objetoTarefa);
        const idDeletar = tarefa.body.id;

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

const objetoCriarTarefa = (idUser: string) => (
    {
        description: 'Teste de criar tarefa e atualizada',
        priority: 'Baixa',
        deadline: new Date(),
        completed: false,
        userId: idUser
    }
);