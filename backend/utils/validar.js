import { getRoleUser } from '../services/usersService.js';
import erroStatus from './erroStatus.js';
import { read } from '../config/database.js';

const STATUS_VALIDOS = ['pendente', 'em andamento', 'concluído'];

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
            console.log(role);

            throw erroStatus(`Apenas usuários com perfil ${roleEsperado.join(', ')} podem executar essa ação`, 403);
        }
    } else {
        if (role !== roleEsperado) {
            throw erroStatus(`Apenas usuários com perfil ${roleEsperado} podem executar essa ação`, 403);
        }
    }
}
export function validarEmail(email) {
    // Regex robusta baseada na RFC 5322 (aceita a maioria dos emails válidos reais)
    const emailRegex =
        /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    if (!email || !emailRegex.test(email)) {
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
