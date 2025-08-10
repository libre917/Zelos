import { read, readAll, create, update } from "../config/database.js";
import { User } from "../model/User.js";
import erroStatus from "../utils/erroStatus.js";

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
        const userData = new User(data);
        const emailExistente =  await read('usuarios', `email = '${userData.email}'`)
        if(emailExistente){
            throw erroStatus('Email já cadastrado', 409);
        }
        
        return await create('usuarios', userData);
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
