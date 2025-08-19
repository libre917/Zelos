import express from 'express';
import { 
    createTicketController, 
    getTicketController, 
    getTicketsController, 
    setTechnicianToTicketController,
    getRecordController
} from '../controllers/TicketsController.js';
import reportRoute from './reportRotas.js';

const router = express.Router();

// Rota para obter todos os chamados
router.get('/', getTicketsController);

// Rota para obter um chamado específico
router.get('/:id', getTicketController);

// rota para obter um registro específico
router.get('/:id/record', getRecordController);

// Rota para criar um novo chamado
router.post('/', createTicketController);

// Rota para setar um técnico a um chamado
router.put('/:id/tecnico', setTechnicianToTicketController);

router.use('/', reportRoute);


export default router;