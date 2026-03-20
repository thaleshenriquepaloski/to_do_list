# TO-DO List API

## Uma API robusta para gerenciamento de tarefas, construída com foco em boas práticas, tipagem forte e persistência de dados.

**Boas Práticas Utilizadas no Desenvolvimento**

- Outside-In TDD: Testes de integração guiando o desenvolvimento.
- Object Mapping: Contrução dinâmica de objetos para atualização de dados.
- Clean Error Handling: Tratamento de erros centralizado via Middleware, utilizando em exceções customizadas (AppError) e eliminando `try/catch` nos controllers; 

**Status do Projeto**: **EM DESENVOLVIMENTO** *Estrutura Core & Error Handling Finalizados*

Atualmente, a fundação do banco de dados, estrutura do servidor, o CRUD completo(Controller/Service), e cobertura de testes estão 100% operacionais e validados por testes.
*Próximos passos:* `feature/users-auth` Implementar autenticação, JWT e isolamento de tarefas por usuário.

**Tecnologias Utilizadas:**

* Node.js(v20 +)
* TypeScript (v5.9 +)
* Express(v5.2) - Framework web
* Prisma ORM (v7.4) - Manipulação do banco de dados
* LibSQL / SQLite - Banco de dados local e leve
* TSX - Executor de TypeScript de alta performance
* Vitest - Executor dos testes


**Pré-requisitos**

Antes de começar, você vai precisar ter instalado em sua máquina:

- Node.js
- NPM


# Instalação e Configuração

**1. Clone do repositório:**

- `git clone git@github.com:thaleshenriquepaloski/to_do_list.git`

**2. Variáveis de Ambiente:**

- Copie e cole as configurações abaixo no seu .env:

- POSTGRES_USER=user
- POSTGRES_PASSWORD=password
- POSTGRES_DB=todolist
- DATABASE_URL="postgresql://user:password@db:5432/todolist?schema=public"
- PORT=3000
- JWT_SECRET="qualquer_string_muito_louca_aqui_123"

**3. Suba os containers**

- `sudo docker compose up -d --build`

**4.  Como o banco sobe zerado, você precisa criar as tabelas**

- `sudo docker compose exec api npx prisma migrate dev --name init`


**Testat a API**

O container da API já esta confugurado para auto-reload:

- `http://localhost:3000`

## Tabela de Endpoints:

- Listar todas as tarefas: **GET** `/tarefas`
- Busca uma tarefa por ID: **GET** `/tarefas/:id`
- Cria uma nova tarefa:    **POST** `/tarefas`
- Atualiza uma tarefa:     **PATCH** `/tarefas/:id`
- Deleta uma tarefa:       **DELETE** `/tarefas/:id`

**Como rodar os testes:**

- `npm test` (modo watch)

O servidor estará disponível em http://localhost:3000

