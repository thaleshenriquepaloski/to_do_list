import { Request, Response, NextFunction } from "express";
import { AppError } from '../erros/AppError.ts';

export const errorMiddleware = (
    error: Error & Partial<AppError>,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Erro interno do servidor';

    return res.status(statusCode).json({
        status: 'error',
        message
    });
}