import { getReport, getReports, createReport, updateReport, } from "../models/Reports.js";

export async function getReportsController(req, res) {
    try {
        const { ticketId, technicianId, startDate, endDate } = req.query;
        
        let reports;
        
        if (ticketId) {
            reports = await getReportsByTicket(ticketId);
        } else if (technicianId) {
            reports = await getReportsByTechnician(technicianId);
        } else if (startDate && endDate) {
            reports = await getReportsByDateRange(startDate, endDate);
        } else {
            reports = await getReports();
        }
        
        res.status(200).json(reports);
    } catch (err) {
        console.error("Erro ao buscar apontamentos:", err);
        res.status(500).json({ message: "Erro ao buscar apontamentos" });
    }
}

export async function getReportController(req, res) {
    try {
        const id = req.params.id;
        const report = await getReport(id);
        
        if (!report) {
            return res.status(404).json({ message: "Apontamento não encontrado" });
        }
        
        res.status(200).json(report);
    } catch (err) {
        console.error("Erro ao buscar apontamento:", err);
        res.status(500).json({ message: "Erro ao buscar apontamento" });
    }
}

export async function createReportController(req, res) {
    try {
        const { chamado_id, tecnico_id, descricao } = req.body;
        
        const data = {
            chamado_id,
            tecnico_id: tecnico_id || req.usuarioId,
            descricao: descricao || null,
        };
        
        const createdReport = await createReport(data);
        res.status(201).json({ 
            message: "Apontamento criado com sucesso", 
            id: createdReport 
        });
    } catch (err) {
        console.error("Erro ao criar apontamento:", err);
        res.status(500).json({ message: "Erro ao criar apontamento" });
    }
}

export async function updateReportController(req, res) {
    try {
        const id = req.params.id;
        const { chamado_id, tecnico_id, descricao } = req.body;
        
        const data = {};
        if (chamado_id !== undefined) data.chamado_id = chamado_id;
        if (tecnico_id !== undefined) data.tecnico_id = tecnico_id;
        if (descricao !== undefined) data.descricao = descricao;
        
        const updatedRows = await updateReport(id, data);
        
        if (updatedRows === 0) {
            return res.status(400).json({ message: "Nenhuma alteração foi feita" });
        }
        
        res.status(200).json({ message: "Apontamento atualizado com sucesso" });
    } catch (err) {
        console.error('Erro ao atualizar apontamento:', err);
        res.status(500).json({ message: "Erro ao atualizar apontamento" });
    }
}