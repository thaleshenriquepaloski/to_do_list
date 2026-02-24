import 'dotenv/config';
import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql";


const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaLibSql({
    url: connectionString
});
const prisma = new PrismaClient({ adapter });

export default prisma

// Função para testar conexão:

// async function main() {
//     console.log('--- Iniciando teste no banco ---')

//     const novaTarefa = await prisma.todo.create({
//         data: {
//             description: "O gemini não tava me ajudando kk",
//             priority: 'Alta',
//             deadline: new Date()
//         },
//     })

//     console.log('Tarefa criada:', novaTarefa)

//     const todasAsTarefas = await prisma.todo.findMany();
//     console.log('Lista de tarefas no banco:', todasAsTarefas);
// }

// main()
//     .catch((e) => {
//         console.error('Erro no teste:', e)
//         process.exit(1)
//     })
//     .finally(async () => {
//         await prisma.$disconnect()
//     })