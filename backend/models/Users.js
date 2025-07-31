import { read, readAll, create, update } from "../config/database.js";

export async function getUsers() {
    try {
        return await readAll('usuarios');
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        throw err;
    }
}

export async function getUser(id) {
    try{
        return await read('usuarios', `id = '${id}'`)
    } catch(err) {
        console.error('Erro ao buscar usuário:', err);
        throw err;
    }
}

export async function createUser(data){
    try{
        return await create('usuarios', data);
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        throw err
    }
}

export async function updateUser(id, data){
    try{
        return await update('usuarios', data, `id = ${id}`)
    } catch (err) {
        console.error('Erro ao atualizar o usuário:', err);
        throw err
    }
}
