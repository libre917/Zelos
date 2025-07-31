import express from 'express';
import { createUserController, getUserController, getUsersController, updateUserController } from '../controllers/UsersController.js';
const router = express.Router();

//rota para obter usuarios;
router.get('/', getUsersController);

//rota para obter um usuarioz
router.get('/:id', getUserController)

//rota para criar usuario 
router.post('/', createUserController);

//rota para atualizar usuario
router.put('/:id', updateUserController);

export default router