import express from 'express';
import { getReportController, getReportsController, createReportController } from '../controllers/ReportContoller.js';
const router = express.Router();

//rota para obter apontamento
router.get('/:ticket_id/reports',   getReportsController);

//rota para obter um apontamento
router.get('/:ticket_id/reports/:id',  getReportController);

//rota para criar apontamento
router.post('/:ticket_id/reports', createReportController);


export default router