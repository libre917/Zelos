import express from 'express';
import passport from '../config/ldap.js';
import { loginController, logoutController } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/login', loginController)

// Rota de Logout
router.post('/logout', logoutController);

// Rota para verificar autenticação
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ 
      authenticated: true,
      user: {
        username: req.user.username,
        displayName: req.user.displayName
      }
    });
  }
  res.status(401).json({ authenticated: false });
});

export default router;