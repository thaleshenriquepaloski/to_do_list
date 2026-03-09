import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from '../app.ts';
import db from "../lib/config/dbConnection.ts";

    const novoUsuarioObjeto = {
        email: 'userteste@fluxo.com',
        password: 'senhafluxo',
        name: 'Henrique'
    };

    const novaTarefa = {
        description: "Estudar JWT",
        priority: "alta",
        deadline: "2026-03-15T23:59:00.000Z"
    };    

afterAll(async () => {
    await db.todo.deleteMany({ where: { priority: novaTarefa.priority }});
    await db.user.deleteMany({ where: { email: novoUsuarioObjeto.email }});
});

const retornaToken = async () => {
    const login = await request(app)
        .post('/auth/login')
        .send({
            email: novoUsuarioObjeto.email,
            password: novoUsuarioObjeto.password
        });
        const token = login.body.token;
        return token
};

describe('Testando fluxo de cadastro usuário', () => {
    
    it('Deve efetuar o cadastro do usuário', async () => {
        const response = await request(app)
            .post('/usuarios/cadastrar').send(novoUsuarioObjeto);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(novoUsuarioObjeto.email);
    });

    it('Deve fazer login', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: novoUsuarioObjeto.email,
                password: novoUsuarioObjeto.password
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('Deve cadastrar uma tarefa no usuario', async () => {
        const token = await retornaToken();

        const response = await request(app)
            .post('/tarefas/cadastrar')
            .set('Authorization', `Bearer ${token}`)
            .send(novaTarefa)

        expect(response.status).toBe(201);
    });

    it('Deve pegar todas as tarefas do usuário', async () => {
        const token = await retornaToken();

        const response = await request(app)
            .get('/tarefas/pegar')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200);  
    });

    it('Deve pegar uma tarefa do usuario pelo id', async () => {
        const token = await retornaToken();

        const tarefa = await request(app)
            .post('/tarefas/cadastrar')
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: "Teste pegar por id",
                priority: "alta", //deve ser alta para o afterAll apagar
                deadline: "2026-03-15T23:59:00.000Z"
            });

        const tarefaId = tarefa.body.id;

        const response = await request(app)
            .get(`/tarefas/pegar/${tarefaId}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(200);
    });

    it('Deve atualizar um campo da tarefa', async () => {
        const token = await retornaToken();
        
        const tarefa = await request(app)
        .post('/tarefas/cadastrar')
        .set('Authorization', `Bearer ${token}`)
        .send({
            description: 'Tarefa desatualizada',
            priority: 'alta',
            deadline: "2026-03-15T23:59:00.000Z"
        });
        const idTarefa = tarefa.body.id;
        
        const response = await request(app)
            .patch(`/tarefas/atualizar/${idTarefa}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: 'Tarefa atualizada'
            });

        expect(response.status).toBe(200);
        expect(response.body.description).toBe('Tarefa atualizada');
    });

    it('Deve excluir uma tarefa', async () => {
        const token = await retornaToken();

        const tarefa = await request(app)
            .post('/tarefas/cadastrar')
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: 'Tarefa desatualizada',
                priority: 'alta',
                deadline: "2026-03-15T23:59:00.000Z"
            });
        const idTarefa = tarefa.body.id;

        const response = await request(app)
            .delete(`/tarefas/deletar/${idTarefa}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(204);
    })
});