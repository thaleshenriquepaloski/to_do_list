import UsuarioService from "../services/UsuarioService.ts";
import { Request, Response } from 'express';

const usuarioService = new UsuarioService();

class UsuarioController {
    async cadastrarUsuario (req: Request, res: Response) {
        const novoUsuario = await usuarioService.cadastrarUsuario(req.body);
        return res.status(201).json(novoUsuario);
    }
}

export default UsuarioController;