# TO-DO List API

## Uma API robusta para gerenciamento de tarefas, construída com foco em boas práticas, tipagem forte e persisntência de dados.

**Status do Projeto**: *Em desenvolvimento*

Atualmente, a fundação do banco de dados e a estrutura do servidor estão prontas.
Próximo passo é a implementação do CRUD.


**Tecnologias Utilizadas:**

* Node.js(v20 +)
* TypeScript (v5.9 +)
* Express(v5.2) - Framework web
* Prisma ORM (v7.4) - Manipulação do banco de dados
* LibSQL / SQLite - Banco de dados local e leve
* TSX - Executor de TypeScript de alta performance


**Pré-requisitos**

Antes de começar, você vai precisar ter instalado em sua máquina:

- Node.js
- NPM


# Instalação e Configuração

**1. Clone do repositório:**

- `git clone 'link-do-rep'`

**2. Instale as dependências:**

- `npm install`

**3. Variáveis de Ambiente:**

- Crie um arquivo .env na raiz do projeto e adicione a URL de conexão com o SQLite. O Prisma 7 com o adapter LibSQL utiliza o seguinte formato:
- DATABASE_URL="file:./dev.db"

**4. Gere o Prisma Client:**

- `npx prisma generate`

**5.  Rode as Migrations (para criar as tabelas):**

- `npx prisma migrate dev --name init`


**Como rodar o projeto**

Para iniciar o servidor em modo de desenvolvimento (com auto-reload):

- `npm run dev`


O servidor estará disponível em http://localhost:3000

