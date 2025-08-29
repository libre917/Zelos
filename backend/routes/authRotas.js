import express from 'express';
import { checkAuth, loginController, logoutController } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/login', loginController)

// Rota de Logout
router.post('/logout', logoutController);

// Rota para verificar autenticação
router.get('/check-auth', checkAuth);

export default router;