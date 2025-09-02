import express from 'express';
import {
    createTicketController,
    getTicketController,
    getTicketsController,
    setTechnicianToTicketController,
    getRecordController,
    getTicketsByUserController,
    getTicketsByTechnicianController,
    getTicketsByStatusController,
    getTicketsThatTechnicianIsPermitedController,
    resolveTicketController,
} from '../controllers/TicketsController.js';
import reportRoute from './reportRotas.js';

const router = express.Router();

// rota para obter chamados
router.get('/', getTicketsController);

// rotas para obter chamados por filtros
router.get('/info/user', getTicketsByUserController);

// rota para obter chamados que o tecnico pode ver
router.get('/info/tecnico', getTicketsThatTechnicianIsPermitedController);

// rota para criar um chamado
router.post('/', createTicketController);

// rota para atribuir um técnico a um chamado
router.put('/:id/tecnico', setTechnicianToTicketController);

// Rota atualizada para resolver chamado
router.put('/:id/tecnico/resolve', resolveTicketController);

router.use('/', reportRoute);

export default router;
