import PDFDocument from 'pdfkit';
import fs from 'fs';
import { read, readAll, create } from '../config/database.js';
import { Report } from '../model/Report.js';
import { getTicket, getRecord, getTickets } from './ticketsService.js';
import erroStatus from '../utils/erroStatus.js';
import { validarCamposObrigatorios, validarRole } from '../utils/validar.js';

// Services
export async function getReports(ticket_id) {
    try {
        return await readAll('apontamentos', `chamado_id = '${ticket_id}'`);
    } catch (err) {
        console.error('Erro ao obter apontamentos:', err);
        throw err;
    }
}

export async function getReport(ticket_id, id) {
    try {
        return await read('apontamentos', `id = '${id}' AND chamado_id = '${ticket_id}'`);
    } catch (err) {
        console.error('Erro ao obter apontamento:', err);
        throw err;
    }
}

export async function createReport(data) {
    try {
        // Validação de obrigatórios
        validarCamposObrigatorios(data, ['chamado_id', 'tecnico_id', 'descricao', 'comeco', 'fim']);

        // Verifica se o chamado existe
        const chamadoExistente = await getTicket(data.chamado_id);
        if (!chamadoExistente) {
            throw erroStatus('Chamado não encontrado', 404);
        }

        // Verifica se o usuário é técnico
        await validarRole(data.tecnico_id, 'tecnico');

        // Cria o apontamento
        const report = new Report(data);
        return await create('apontamentos', report);
    } catch (err) {
        console.error('Erro ao criar apontamento:', err);
        throw err;
    }
}

// Função para gerar PDF do chamado
export async function gerarRelatorioChamado(chamadoId, caminhoSaida = `relatorio-${chamadoId}.pdf`) {
    const record = await getRecord(chamadoId);
    if (!record) {
        throw new Error('Chamado não encontrado');
    }

    const doc = new PDFDocument();
    const out = fs.createWriteStream(caminhoSaida);
    doc.pipe(out);

    // Cabeçalho
    doc.fontSize(20).text('Relatório de Chamado', { align: 'center' });
    doc.moveDown();

    // Dados do chamado
    doc.fontSize(14).text(`ID: ${record.chamado.id}`);
    doc.text(`Título: ${record.chamado.titulo}`);
    doc.text(`Descrição: ${record.chamado.descricao}`);
    doc.text(`Status: ${record.chamado.status}`);
    doc.text(`Criado em: ${new Date(record.chamado.criado_em).toLocaleString()}`);
    doc.moveDown();

    // Solicitante
    if (record.solicitante) {
        doc.fontSize(16).text('Solicitante:', { underline: true });
        doc.fontSize(12).text(`Nome: ${record.solicitante.nome}`);
        doc.text(`Email: ${record.solicitante.email}`);
        doc.moveDown();
    }

    // Técnico
    if (record.tecnico) {
        doc.fontSize(16).text('Técnico:', { underline: true });
        doc.fontSize(12).text(`Nome: ${record.tecnico.nome}`);
        doc.text(`Email: ${record.tecnico.email}`);
        doc.moveDown();
    }

    // Pool
    if (record.pool) {
        doc.fontSize(16).text('Tipo de Chamado:', { underline: true });
        doc.fontSize(12).text(`Título: ${record.pool.titulo}`);
        doc.text(`Descrição: ${record.pool.descricao}`);
        doc.moveDown();
    }

    // Apontamentos
    if (record.apontamentos.length > 0) {
        doc.fontSize(16).text('Apontamentos:', { underline: true });
        record.apontamentos.forEach((a, i) => {
            doc.fontSize(12).text(
                `${i + 1}. ${a.descricao} (Início: ${a.comeco}, Fim: ${a.fim}, Duração: ${a.duracao}min)`
            );
        });
    }

    // Finaliza o PDF
    doc.end();

    await new Promise((resolve, reject) => {
        out.on('finish', resolve);
        out.on('error', reject);
    });

    return caminhoSaida;
}

function isNonEmptyArray(val) {
    return Array.isArray(val) && val.length > 0;
}

export async function gerarRelatorioTodosChamados(caminhoSaida = 'relatorio-chamados.pdf') {
    const ticketsRaw = await getTickets();

    // Normaliza possíveis formatos ({ rows: [...] } ou já array)
    const tickets = Array.isArray(ticketsRaw) ? ticketsRaw : ticketsRaw?.rows ?? [];

    if (!isNonEmptyArray(tickets)) {
        throw new Error('Nenhum chamado encontrado');
    }

    // Busca todos os records em paralelo (mais rápido)
    const records = await Promise.all(
        tickets.map(
            (t) => getRecord(t.id).catch(() => null) // evita quebrar o PDF por 1 registro com erro
        )
    );

    const doc = new PDFDocument({ margin: 50 });
    const out = fs.createWriteStream(caminhoSaida);
    doc.pipe(out);

    // Título principal
    doc.fontSize(22).text('Relatório de Chamados', { align: 'center' });
    doc.moveDown(2);

    for (const record of records) {
        if (!record || !record.chamado) continue;

        doc.fontSize(16).text(`Chamado #${record.chamado.id}`, { underline: true });
        doc.moveDown(0.5);

        // Dados básicos
        doc.fontSize(12).text(`Título: ${record.chamado.titulo ?? '-'}`);
        doc.text(`Descrição: ${record.chamado.descricao ?? '-'}`);
        doc.text(`Status: ${record.chamado.status ?? '-'}`);
        const criadoEm = record.chamado.criado_em ? new Date(record.chamado.criado_em).toLocaleString() : '-';
        doc.text(`Criado em: ${criadoEm}`);
        doc.moveDown(0.5);

        // Solicitante
        if (record.solicitante) {
            doc.text(`Solicitante: ${record.solicitante.nome ?? '-'} (${record.solicitante.email ?? '-'})`);
        }

        // Técnico
        if (record.tecnico) {
            doc.text(`Técnico: ${record.tecnico.nome ?? '-'} (${record.tecnico.email ?? '-'})`);
        }

        // Pool
        if (record.pool) {
            doc.text(`Tipo: ${record.pool.titulo ?? '-'} - ${record.pool.descricao ?? '-'}`);
        }

        doc.moveDown(0.5);

        // Apontamentos
        if (isNonEmptyArray(record.apontamentos)) {
            doc.text('Apontamentos:');
            record.apontamentos.forEach((a, i) => {
                const inicio = a.comeco ?? '-';
                const fim = a.fim ?? '-';
                const dur = a.duracao ?? '-';
                doc.text(`  ${i + 1}. ${a.descricao ?? '-'} | Início: ${inicio} | Fim: ${fim} | Duração: ${dur} min`);
            });
        }

        // Linha separadora (respeita largura da página/margens)
        doc.moveDown(1);
        const left = doc.page.margins.left;
        const right = doc.page.width - doc.page.margins.right;
        doc.moveTo(left, doc.y).lineTo(right, doc.y).stroke();
        doc.moveDown(1);
    }

    // Finaliza e aguarda terminar a escrita do arquivo
    doc.end();

    await new Promise((resolve, reject) => {
        out.on('finish', resolve);
        out.on('error', reject);
    });

    return caminhoSaida;
}
