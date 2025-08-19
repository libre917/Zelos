import { getTickets, getTicket, createTicket, setTechnicianToTicket, getRecord } from '../services/ticketsService.js';
import { getRoleUser } from '../services/usersService.js';

export async function getTicketsController(req, res) {
    try {
        const tickets = await getTickets();
        res.status(200).json(tickets);
    } catch (err) {
        console.error('Erro ao buscar chamados:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}

export async function getTicketController(req, res) {
    try {
        const id = req.params.id;
        const ticket = await getTicket(id);

        if (!ticket) {
            return res.status(404).json({ message: 'Chamado não encontrado' });
        }

        res.status(200).json(ticket);
    } catch (err) {
        console.error('Erro ao buscar chamado:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}

export async function getRecordController(req, res) {
    try {
        const id = req.params.id;
        const record = await getRecord(id);

        if (!record) {
            return res.status(404).json({ message: 'Registro não encontrado' });
        }

        res.status(200).json(record);
    } catch (error) {
        console.error('Erro ao buscar registro:', error);
        const status = error.status || 500;
        const mensagem = error.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
        
    }
}

export async function createTicketController(req, res) {
    try {
        const { titulo, descricao, tipo_id } = req.body;
        const data = {
            titulo,
            descricao,
            tipo_id: tipo_id ,
            usuario_id: req.usuarioId, // Usa o ID do usuário logado
        };
        

        const createdTicket = await createTicket(data);
        res.status(201).json({
            message: 'Chamado criado com sucesso',
            id: createdTicket,
        });
    } catch (err) {
        console.error('Erro ao criar chamado:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}

export async function setTechnicianToTicketController(req, res) {
    try {
        const id = req.params.id;
        let tecnico_id = req.usuarioId;
        const role = await getRoleUser(tecnico_id);
        if (role !== 'tecnico') {
            tecnico_id = req.body.tecnico_id;
            if (!tecnico_id) {
                return res.status(400).json({ message: 'ID do técnico é obrigatório' });
            }
            const technicianRole = await getRoleUser(tecnico_id);
            if (technicianRole !== 'tecnico') {
                return res.status(400).json({ message: 'ID do técnico inválido' });
            }
        }
        const updatedRows = await setTechnicianToTicket(id, tecnico_id);

        if (updatedRows === 0) {
            return res.status(400).json({ message: 'Nenhuma alteração foi feita' });
        }
        res.status(200).json({ message: 'Técnico atribuído ao chamado com sucesso' });
    } catch (err) {
        console.error('Erro ao atribuir técnico ao chamado:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}
