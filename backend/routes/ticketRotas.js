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
    resolveTicketController // ✅ Usar o controller atualizado
} from '../controllers/TicketsController.js';
import reportRoute from './reportRotas.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas existentes...
router.get('/', getTicketsController);
router.get('/:id', getTicketController);
router.get('/info/user', getTicketsByUserController);
router.get('/info/tecnico', getTicketsThatTechnicianIsPermitedController);
router.get('/info/tecnico/:id', getTicketsByTechnicianController);
router.get('/info/status/:status', getTicketsByStatusController);
router.get('/:id/record', getRecordController);
router.post('/', createTicketController);
router.put('/:id/tecnico', setTechnicianToTicketController);

// ✅ Rota atualizada para resolver chamado (agora aceita apontamento)
router.put('/:id/tecnico/resolve', resolveTicketController);

router.use('/', reportRoute);

export default router;