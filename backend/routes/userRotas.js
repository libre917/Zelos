import express from 'express';
import { createUserController, getUsersController, updateUserController, createTechnicianController, setStatusUserController, getRoleController, getMeController } from '../controllers/UsersController.js';

const router = express.Router();

//rota para obter usuarios;
router.get('/',  getUsersController);

//rota para obter informações de um usuario
router.get('/me/info', getMeController);

//rota para obter a role do usuario
router.get('/me/role', getRoleController);

//rota para criar usuario 
router.post('/', createUserController);

//rota para criar tecnico
router.post('/tecnico', createTechnicianController);

//rota para atualizar usuario
router.put('/:id', updateUserController);

//rota para atualizar status do usuario
router.put('/:id/status', setStatusUserController);

export default router