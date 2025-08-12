import express from 'express';
import { getReportController, getReportsController, createReportController } from '../controllers/ReportContoller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

//rota para obter apontamento
router.get('/',   getReportsController);

//rota para obter um apontamento
router.get('/:id',  getReportController);

//rota para criar apontamento
router.post('/', createReportController);


export default router