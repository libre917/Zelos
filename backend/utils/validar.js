import { getRoleUser } from "../services/usersService.js";
import { read } from "../config/database.js";

const STATUS_VALIDOS = ['pendente', 'em_andamento', 'concluido'];
const TITULOS_VALIDOS = ['externo', 'manutencao', 'apoio_tecnico', 'limpeza'];

// Para verificar se os campos desejados estão preenchidos
export function validarCamposObrigatorios(data, campos) {
    for (const campo of campos) {
        if (!data[campo]) {
            throw erroStatus(`Campo obrigatório ausente: ${campo}`, 400);
        }
    }
}

// Para verificar se o status enviado é válido
export function validarStatus(status) {
    if (status && !STATUS_VALIDOS.includes(status)) {
        throw erroStatus(`Status inválido. Válidos: ${STATUS_VALIDOS.join(', ')}`, 400);
    }
}

// Verifica se a função do usuário é válida ou não
export async function validarRole(userId, roleEsperado) {
    const role = await getRoleUser(userId);
    if (Array.isArray(roleEsperado)) {
        if (!roleEsperado.includes(role)) {
            throw erroStatus(`Apenas usuários com perfil ${roleEsperado.join(', ')} podem executar essa ação`, 403);
        }
    } else {
        if (role !== roleEsperado) {
            throw erroStatus(`Apenas usuários com perfil ${roleEsperado} podem executar essa ação`, 403);
        }
    }
}
export function validarEmail(email) {
    if (!email || !email.includes('@') || !email.includes('.com')) {
        throw erroStatus('Email inválido', 400);
    }
}
// Verifica se email já está cadastrado
export async function checkEmailDuplicado(email) {
    const emailExistente = await read('usuarios', `email = '${email}'`);
    if (emailExistente) {
        throw erroStatus('Email já cadastrado', 409);
    }
}

// Verifica se o título está entre os válidos
export function validarTitulo(titulo) {
    if (!TITULOS_VALIDOS.includes(titulo)) {
        throw erroStatus(
            'Título deve ser um dos seguintes: ' + TITULOS_VALIDOS.join(', '),
            400
        );
    }
}
