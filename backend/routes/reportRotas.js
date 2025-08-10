import express from 'express';
import { createReportController, getReportController, getReportsController, updateReportController } from '../controllers/ReportContoller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

//rota para obter apontamento
router.get('/',   getReportsController);

//rota para obter um apontamento
router.get('/:id',  getReportController);

//rota para criar apontamento
router.post('/', createReportController);

//rota para atualizar apontamento
router.put('/:id',  updateReportController);

export default router