import express from 'express';
import { 
    createTicketController, 
    getTicketController, 
    getTicketsController, 
    setTechnicianToTicketController,
    getRecordController,
    getTicketsByUserController,
    getTicketsByTechnicianController,
    getTicketsByStatusController
} from '../controllers/TicketsController.js';
import reportRoute from './reportRotas.js';

const router = express.Router();

// Rota para obter todos os chamados
router.get('/', getTicketsController);

// Rota para obter um chamado específico
router.get('/:id', getTicketController);

// Rota para obter chamados do usuário autenticado
router.get('/info/user', getTicketsByUserController);

// Rota para obter chamados por técnico
router.get('/info/tecnico/:id', getTicketsByTechnicianController);

// Rota para obter chamados por status
router.get('/info/status/:status', getTicketsByStatusController);

// rota para obter um registro específico
router.get('/:id/record', getRecordController);

// Rota para criar um novo chamado
router.post('/', createTicketController);

// Rota para setar um técnico a um chamado
router.put('/:id/tecnico', setTechnicianToTicketController);

router.use('/', reportRoute);


export default router;