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
    resolveTicketController 
} from '../controllers/TicketsController.js';
import reportRoute from './reportRotas.js';

const router = express.Router();

// rota para obter chamados 
router.get('/', getTicketsController);

// rota para obter um chamado
router.get('/:id', getTicketController);

// rotas para obter chamados por filtros
router.get('/info/user', getTicketsByUserController);

// rota para obter chamados que o tecnico pode ver
router.get('/info/tecnico', getTicketsThatTechnicianIsPermitedController);

// rota para obter chamados por tecnico
router.get('/info/tecnico/:id', getTicketsByTechnicianController);

// rota para obter chamados por status
router.get('/info/status/:status', getTicketsByStatusController);

// rota para obter o histórico de um chamado
router.get('/:id/record', getRecordController);

// rota para criar um chamado
router.post('/', createTicketController);

// rota para atribuir um técnico a um chamado
router.put('/:id/tecnico', setTechnicianToTicketController);

// Rota atualizada para resolver chamado 
router.put('/:id/tecnico/resolve', resolveTicketController);

router.use('/', reportRoute);

export default router;