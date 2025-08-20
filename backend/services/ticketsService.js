import { read, readAll, create, update } from '../config/database.js';
import { Ticket } from '../model/Ticket.js';
import erroStatus from '../utils/erroStatus.js';
import { getPoolTechniciansById } from './poolService.js';
import { validarCamposObrigatorios, validarStatus, validarRole } from '../utils/validar.js';

// Busca todos os chamados
export async function getTickets() {
    try {
        return await readAll('chamados');
    } catch (err) {
        console.error('Erro ao obter chamados:', err);
        throw err;
    }
}

// Busca um chamado de acordo com o ID enviado
export async function getTicket(id) {
    try {
        return await read('chamados', `id = '${id}'`);
    } catch (err) {
        console.error('Erro ao obter chamado:', err);
        throw err;
    }
}

// Busca chamados de um usuário 
export async function getTicketsByUser(userId) {
    try {
        return await readAll('chamados', `usuario_id = '${userId}'`);
    } catch (err) {
        console.error('Erro ao obter chamados do usuário:', err);
        throw err;
    }
}

// Busca chamados que um tecnico está operando
export async function getTicketsByTechnician(technicianId) {
    try {
        return await readAll('chamados', `tecnico_id = '${technicianId}'`);
    } catch (err) {
        console.error('Erro ao obter chamados do técnico:', err);
        throw err;
    }
}

// Busca chamados de um determinado status
export async function getTicketsByStatus(status) {
    try {
        return await readAll('chamados', `status = '${status}'`);
    } catch (err) {
        console.error('Erro ao obter chamados por status:', err);
        throw err;
    }
}

// Monta um relátorio com base de dados já existentes
export async function getRecord(chamadoId) {
    try {
        // busca o chamado
        const chamado = await read('chamados', `id = '${chamadoId}'`);
        if (!chamado) return null;

        // busca dados relacionados em paralelo
        const [pool, solicitante, tecnico, apontamentos] = await Promise.all([
            chamado.tipo_id ? read('pool', `id = '${chamado.tipo_id}'`) : null,
            chamado.usuario_id ? read('usuarios', `id = '${chamado.usuario_id}'`) : null,
            chamado.tecnico_id ? read('usuarios', `id = '${chamado.tecnico_id}'`) : null,
            readAll('apontamentos', `chamado_id = '${chamadoId}'`),
        ]);

        return {
            chamado: {
                id: chamado.id,
                titulo: chamado.titulo,
                descricao: chamado.descricao,
                status: chamado.status,
                criado_em: chamado.criado_em,
            },
            pool: pool ? { id: pool.id, titulo: pool.titulo, descricao: pool.descricao } : null,
            solicitante: solicitante ? { id: solicitante.id, nome: solicitante.nome, email: solicitante.email } : null,
            tecnico: tecnico ? { id: tecnico.id, nome: tecnico.nome, email: tecnico.email } : null,
            apontamentos: (apontamentos || []).map((a) => ({
                id: a.id,
                descricao: a.descricao,
                comeco: a.comeco,
                fim: a.fim,
                duracao: a.duracao,
            })),
        };
    } catch (err) {
        console.error('Erro ao obter registros:', err);
        throw err;
    }
}

// Cria um chamado, e verifica se foi um usuario ou admin que o criou
export async function createTicket(data) {
    try {
        // Verifica obrigatórios
        validarCamposObrigatorios(data, ['titulo', 'descricao', 'usuario_id', 'tipo_id']);

        const ticketData = new Ticket(data);

        // Valida status
        validarStatus(ticketData.status);

        // Apenas "usuario" pode criar chamados
        await validarRole(ticketData.usuario_id, ['usuario', 'admin']);

        // Se tiver técnico, validar se realmente é técnico
        if (ticketData.tecnico_id) {
            await validarRole(ticketData.tecnico_id, 'tecnico');
        }

        // Verifica se o tipo existe
        if (ticketData.tipo_id) {
            const tipoExistente = await read('pool', `id = '${ticketData.tipo_id}'`);
            if (!tipoExistente) {
                throw erroStatus('Tipo de chamado inválido', 400);
            }
        }

        return await create('chamados', ticketData);
    } catch (err) {
        console.error('Erro ao criar chamado:', err);
        throw err;
    }
}

// Atribui um tecnico a um chamado
export async function setTechnicianToTicket(ticketId, technicianId) {
    try {
        validarCamposObrigatorios({ ticketId, technicianId }, ['ticketId', 'technicianId']);

        const ticket = await getTicket(ticketId);
        if (!ticket) {
            throw erroStatus('Chamado não encontrado', 404);
        }
        
        // Se houver pool, valida se técnico pertence à pool
        const [pool] = await getPoolTechniciansById(ticket.tipo_id, technicianId);

        if (!pool) {
            throw erroStatus('Técnico não autorizado para este tipo de chamado', 403);
        }

        const response = await update('chamados', { tecnico_id: technicianId, status: 'em andamento' }, `id = '${ticketId}'`);
        return response;
    } catch (err) {
        console.error('Erro ao atribuir técnico ao chamado:', err);
        throw err;
    }
}
