import express from 'express';
import { getReportController, getReportsController, createReportController, gerarRelatorioChamadoController, gerarRelatorioTodosChamadosController } from '../controllers/ReportController.js';
const router = express.Router();

//rota para obter apontamento
router.get('/:ticket_id/reports', getReportsController);

//rota para gerar relatório de todos os chamados
router.get('/record/pdf', gerarRelatorioTodosChamadosController);

//rota para gerar relatório em PDF
router.get('/:ticket_id/pdf', gerarRelatorioChamadoController)

//rota para criar apontamento
router.post('/:ticket_id/reports', createReportController);


export default router