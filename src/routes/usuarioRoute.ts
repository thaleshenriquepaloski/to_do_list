import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController.ts';

const usuarioController = new UsuarioController();

const router = Router();

router.post('/cadastrar', usuarioController.cadastrarUsuario);
router.get('/buscar', usuarioController.pegarUsuarios);

export default router;