import express from 'express';
import { 
    createTicketController, 
    getTicketController, 
    getTicketsController, 
    setTechnicianToTicketController,
} from '../controllers/TicketsController.js';

const router = express.Router();

// Rota para obter todos os chamados
router.get('/', getTicketsController);

// Rota para obter um chamado específico
router.get('/:id', getTicketController);

// Rota para criar um novo chamado
router.post('/', createTicketController);

// Rota para setar um técnico a um chamado
router.put('/:id/tecnico', setTechnicianToTicketController);

export default router;