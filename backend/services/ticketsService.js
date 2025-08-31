import { read, readAll, create, update } from '../config/database.js';
import { Ticket } from '../model/Ticket.js';
import erroStatus from '../utils/erroStatus.js';
import { getPoolTechnicians, getPoolTechniciansById } from './poolService.js';
import { validarCamposObrigatorios, validarStatus, validarRole } from '../utils/validar.js';
import { getUser } from './usersService.js';

// Busca todos os chamados
export async function getTickets() {
    try {
        const chamados = await readAll('chamados');
        // Buscar nomes relacionados em paralelo
        const chamadosComNomes = await Promise.all(
            chamados.map(async (chamado) => {
                // Busca nome do pool (tipo_id)
                let tipo_nome = null;
                if (chamado.tipo_id) {
                    const pool = await read('pool', `id = '${chamado.tipo_id}'`);
                    tipo_nome = pool ? pool.titulo : null;
                }
                // Busca nome do técnico
                let tecnico_nome = null;
                if (chamado.tecnico_id) {
                    const tecnico = await read('usuarios', `id = '${chamado.tecnico_id}'`);
                    tecnico_nome = tecnico ? tecnico.nome : null;
                }
                // Busca nome do usuário
                let usuario_nome = null;
                if (chamado.usuario_id) {
                    const usuario = await read('usuarios', `id = '${chamado.usuario_id}'`);
                    usuario_nome = usuario ? usuario.nome : null;
                }
                return {
                    ...chamado,
                    tipo: tipo_nome,
                    tecnico: tecnico_nome,
                    usuario: usuario_nome,
                };
            })
        );
        return chamadosComNomes;
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

export async function getTicketsThatTechnicianIsPermited(technicianId) {
    try {
        // Busca o pool do técnico
        const [{ id_pool }] = await getPoolTechnicians(technicianId);
        if (!id_pool) throw erroStatus('Técnico não encontrado');

        // Busca chamados do pool do técnico
        const chamados = await readAll('chamados', `tipo_id = '${id_pool}'`);

        // Enriquecer chamados com nomes (tipo, técnico e usuário)
        const chamadosComNomes = await Promise.all(
            chamados.map(async (chamado) => {
                // Nome do pool
                let tipo_nome = null;
                if (chamado.tipo_id) {
                    const pool = await read('pool', `id = '${chamado.tipo_id}'`);
                    tipo_nome = pool ? pool.titulo : null;
                }

                // Nome do técnico
                let tecnico_nome = null;
                if (chamado.tecnico_id) {
                    const tecnico = await read('usuarios', `id = '${chamado.tecnico_id}'`);
                    tecnico_nome = tecnico ? tecnico.nome : null;
                }

                // Nome do usuário
                let usuario_nome = null;
                if (chamado.usuario_id) {
                    const usuario = await read('usuarios', `id = '${chamado.usuario_id}'`);
                    usuario_nome = usuario ? usuario.nome : null;
                }

                return {
                    ...chamado,
                    tipo: tipo_nome,
                    tecnico: tecnico_nome,
                    usuario: usuario_nome,
                };
            })
        );

        return chamadosComNomes;
    } catch (err) {
        console.error('Erro ao obter chamados do técnico:', err);
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

        // Verifica se título já existe
        const idExistente = await read('chamados', `titulo = '${data.titulo}'`);
        if (idExistente) {
            throw erroStatus('Este chamado já foi criado', 409);
        }

        // Monta o objeto chamado

        const ticketData = new Ticket(data);

        // Valida status
        validarStatus(ticketData.status);

        // Apenas usuarios e admins podem criar chamados
        await validarRole(ticketData.usuario_id, ['usuario', 'Usuário', 'admin']);

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

        const response = await update(
            'chamados',
            { tecnico_id: technicianId, status: 'em andamento' },
            `id = '${ticketId}'`
        );
        return response;
    } catch (err) {
        console.error('Erro ao atribuir técnico ao chamado:', err);
        throw err;
    }
}
