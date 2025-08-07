import { getTickets, getTicket, createTicket, updateTicket } from "../models/Tickets.js";

export async function getTicketsController(req, res) {
    try {
        const tickets = await getTickets();
        res.status(200).json(tickets);
    } catch (err) {
        console.error("Erro ao buscar chamados:", err);
        res.status(500).json({ message: "Erro ao buscar chamados" });
    }
}

export async function getTicketController(req, res) {
    try {
        const id = req.params.id;
        const ticket = await getTicket(id);
        
        if (!ticket) {
            return res.status(404).json({ message: "Chamado não encontrado" });
        }
        
        res.status(200).json(ticket);
    } catch (err) {
        console.error("Erro ao buscar chamado:", err);
        res.status(500).json({ message: "Erro ao buscar chamado" });
    }
}

export async function createTicketController(req, res) {
    try {
        const { titulo, descricao, tipo_id, tecnico_id, usuario_id, status } = req.body;
        
        // Validações básicas
        if (!titulo || !descricao) {
            return res.status(400).json({ message: "Título e descrição são obrigatórios" });
        }
        
        const data = {
            titulo,
            descricao,
            tipo_id: tipo_id || null,
            tecnico_id: tecnico_id || null,
            usuario_id: usuario_id || req.usuarioId, // Usa o ID do usuário logado se não especificado
            status: status || 'pendente'
        };
        
        const createdTicket = await createTicket(data);
        res.status(201).json({ 
            message: "Chamado criado com sucesso", 
            id: createdTicket 
        });
    } catch (err) {
        console.error("Erro ao criar chamado:", err);
        res.status(500).json({ message: "Erro ao criar chamado" });
    }
}

export async function updateTicketController(req, res) {
    try {
        const id = req.params.id;
        const { titulo, descricao, tipo_id, tecnico_id, usuario_id, status } = req.body;
        
        // Verifica se o chamado existe
        const existingTicket = await getTicket(id);
        if (!existingTicket) {
            return res.status(404).json({ message: "Chamado não encontrado" });
        }
        
        const data = {};
        if (titulo !== undefined) data.titulo = titulo;
        if (descricao !== undefined) data.descricao = descricao;
        if (tipo_id !== undefined) data.tipo_id = tipo_id;
        if (tecnico_id !== undefined) data.tecnico_id = tecnico_id;
        if (usuario_id !== undefined) data.usuario_id = usuario_id;
        if (status !== undefined) data.status = status;
        
        const updatedRows = await updateTicket(id, data);
        
        if (updatedRows === 0) {
            return res.status(400).json({ message: "Nenhuma alteração foi feita" });
        }
        
        res.status(200).json({ message: "Chamado atualizado com sucesso" });
    } catch (err) {
        console.error("Erro ao atualizar chamado:", err);
        res.status(500).json({ message: "Erro ao atualizar chamado" });
    }
}