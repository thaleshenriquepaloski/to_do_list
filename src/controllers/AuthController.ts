import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService.ts";

const authService = new AuthService();

class AuthController {

    async login (req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const login = await authService.login({ email, password });
            return res.status(200).json(login);
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;