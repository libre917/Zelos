import express from 'express';
import { createPoolController, getPoolController, getPoolsController, updatePoolController } from '../controllers/PoolController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rota para obter todos os pools
router.get('/', authMiddleware, getPoolsController);

// Rota para obter um pool específico
router.get('/:id', authMiddleware, getPoolController);

// Rota para criar um novo pool
router.post('/', authMiddleware, createPoolController);

// Rota para atualizar um pool
router.put('/:id', authMiddleware, updatePoolController);

export default router;