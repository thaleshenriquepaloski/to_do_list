import db from "../lib/config/dbConnection.ts";
import { compare } from "bcryptjs";
import jwt from 'jsonwebtoken';
import { AppError } from "../erros/AppError.ts";

type loginDTO = {
    email: string,
    password: string
}

class AuthService {

    
    async login (dto: loginDTO) {
        const usuarioExiste = await db.user.findUnique({
            where: {
                email: dto.email
            },
        });
        if(!usuarioExiste) throw new AppError("Email ou senha inválidos", 401);

        const senhaValida = await compare(dto.password, usuarioExiste.password);
        if(!senhaValida) throw new AppError("Email ou senha inválidos", 401);

        const token = jwt.sign(
            { id: usuarioExiste.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        return {
            token,
            user: {
                id: usuarioExiste.id,
                email: usuarioExiste.email,
                nome: usuarioExiste.name
            }
        };

    }
}

export default AuthService;