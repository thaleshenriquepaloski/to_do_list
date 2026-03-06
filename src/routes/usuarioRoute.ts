import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';

const usuarioController = new UsuarioController();

const router = Router();

router.post('/usuarios', usuarioController.cadastrarUsuario);

export default router;