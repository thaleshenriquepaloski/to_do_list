import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../app';

const novoUsuarioTeste = {
    email: 'usuario@teste.com',
    password: 'senhateste',
    name: 'Usuario de Testes'
};

describe('POST /usuario', () => {
    it('Deve cadastrar um novo usuario', async () => {
        const response = await request(app)
            .post('/usuarios').send(novoUsuarioTeste);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(novoUsuarioTeste.email);
    });
})