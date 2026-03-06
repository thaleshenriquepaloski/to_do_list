import UsuarioService from "../services/UsuarioService.ts";
import { NextFunction, Request, Response } from 'express';

const usuarioService = new UsuarioService();

class UsuarioController {
    async cadastrarUsuario (req: Request, res: Response, next: NextFunction) {
        try {
            const novoUsuario = await usuarioService.cadastrarUsuario(req.body);
            return res.status(201).json(novoUsuario);
        } catch (error) {
            next(error)
        }
    }

    async pegarUsuarios (req: Request, res: Response, next: NextFunction) {
        try {
            const usuarios = await usuarioService.pegarUsuarios();
            return res.status(200).json(usuarios);
        } catch (error) {
            next(error)
        }
    } 
}

export default UsuarioController;