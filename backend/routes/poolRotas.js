import express from 'express';
import { createPoolController, getPoolController, getPoolsController, updatePoolController } from '../controllers/PoolController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rota para obter todos os pools
router.get('/',  getPoolsController);

// Rota para obter um pool específico
router.get('/:id',  getPoolController);

// Rota para criar um novo pool
router.post('/',  createPoolController);

// Rota para atualizar um pool
router.put('/:id',  updatePoolController);

export default router;