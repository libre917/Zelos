import express from 'express';
import { createReportController, getReportController, getReportsController, updateReportController } from '../controllers/ReportContoller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

//rota para obter apontamento
router.get('/', authMiddleware,  getReportsController);

//rota para obter um apontamento
router.get('/:id', authMiddleware, getReportController);

//rota para criar apontamento
router.post('/', createReportController);

//rota para atualizar apontamento
router.put('/:id', authMiddleware, updateReportController);

export default router