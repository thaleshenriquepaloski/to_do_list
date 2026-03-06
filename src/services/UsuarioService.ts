import { AppError } from "../erros/AppError.ts";
import db from "../lib/config/dbConnection.ts";
import { z } from 'zod';
import { hash } from 'bcryptjs';

class UsuarioService {

    private static userSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),  
    })

    async cadastrarUsuario (dto: z.infer<typeof UsuarioService.userSchema>) {

        const validatedData = UsuarioService.userSchema.parse(dto);

        const usuarioExiste = await db.user.findUnique({
            where: { email: validatedData.email },
            select: { id: true }
        });

        if(usuarioExiste) throw new AppError('Usuário já cadastrado');

        const senhaHasheada = await hash(validatedData.password, 8);

        const novoUsuario = await db.user.create({
            data: {
                email: validatedData.email,
                password: senhaHasheada,
                name: validatedData.name
            }
        });

        return {
            id: novoUsuario.id,
            email: novoUsuario.email,
            name: novoUsuario.name
        };
    }
}

export default UsuarioService;