import express from 'express';
import { createUserController, getUserController, getUsersController, updateUserController, createTechnicianController, setStatusUserController, getRoleController } from '../controllers/UsersController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

//rota para obter usuarios;
router.get('/', authMiddleware,  getUsersController);

//rota para obter um usuarios
router.get('/:id', authMiddleware, getUserController)

//rota para obter a role do usuario
router.get('/me/role', authMiddleware, getRoleController);

//rota para criar usuario 
router.post('/',authMiddleware, createUserController);

//rota para criar tecnico
router.post('/tecnico', authMiddleware, createTechnicianController);

//rota para atualizar usuario
router.put('/:id', authMiddleware, updateUserController);

//rota para atualizar status do usuario
router.put('/:id/status', authMiddleware, setStatusUserController);

export default router