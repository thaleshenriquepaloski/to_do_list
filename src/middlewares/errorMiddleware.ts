import type { Request, Response, NextFunction } from 'express';
import type { AppError } from '../erros/AppError.ts';

export const errorMiddleware = (
    error: Error & Partial<AppError>,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if(process.env.NODE_TEST) {
        console.error("DEBUG ERRO:", error)
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Erro interno do servidor';

    return res.status(statusCode).json({
        status: 'error',
        message
    });
}