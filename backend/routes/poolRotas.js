import express from 'express';
import { createPoolController, deletePoolController, getPoolController, getPoolsController, getPoolsWithTicketsController, getTicketsByPoolIdController, updatePoolController } from '../controllers/PoolController.js';

const router = express.Router();

// Rota para obter todos os pools
router.get('/',  getPoolsController);

// rota para obter pools com quantidade de tickets
router.get('/with-tickets',  getPoolsWithTicketsController);

// Rota para obter um pool específico
router.get('/:id',  getPoolController);

// Rota para criar um novo pool
router.post('/',  createPoolController);

// Rota para atualizar um pool
router.put('/:id',  updatePoolController);

// Rota para deletar um pool
router.delete('/:id', deletePoolController); 

export default router;