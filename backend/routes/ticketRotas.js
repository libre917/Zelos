import express from 'express';
import { 
    createTicketController, 
    getTicketController, 
    getTicketsController, 
    updateTicketController,
} from '../controllers/TicketsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rota para obter todos os chamados
router.get('/', authMiddleware, getTicketsController);

// Rota para obter um chamado específico
router.get('/:id', authMiddleware, getTicketController);

// Rota para criar um novo chamado
router.post('/', authMiddleware, createTicketController);

// Rota para atualizar um chamado
router.put('/:id', authMiddleware, updateTicketController);

export default router;