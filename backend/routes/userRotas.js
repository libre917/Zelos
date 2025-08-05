import express from 'express';
import { createUserController, getUserController, getUsersController, updateUserController } from '../controllers/UsersController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

//rota para obter usuarios;
router.get('/', authMiddleware,  getUsersController);

//rota para obter um usuarioz
router.get('/:id', authMiddleware, getUserController)

//rota para criar usuario 
router.post('/', createUserController);

//rota para atualizar usuario
router.put('/:id', authMiddleware, updateUserController);

export default router