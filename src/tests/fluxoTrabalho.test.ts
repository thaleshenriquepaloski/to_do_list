import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from '../app.ts';
import db from "../lib/config/dbConnection.ts";

    const novoUsuarioObjeto = {
        email: 'userteste@fluxo.com',
        password: 'senhafluxo',
        name: 'Henrique'
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

    it('Deve cadastrar uma tarefa autenticado', async () => {
        
    });

    afterAll(async () => {
        await db.user.deleteMany({
            where: {
                email: novoUsuarioObjeto.email
            }
        });
    });
})