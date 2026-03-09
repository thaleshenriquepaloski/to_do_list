import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

type JwtPayload = {
    id: string,
    email: string
}

const jsonSecret = process.env.JWT_SECRET as string;

const verificaAutenticacao = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(401).json({ message: 'Token não foi informado' });

    const [, token] = authHeader.split(' ');

    try {
        const payload = jwt.verify(token, jsonSecret) as JwtPayload;

        req.user = payload;

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Usuário  não autenticado' });
    }
};

export default verificaAutenticacao;