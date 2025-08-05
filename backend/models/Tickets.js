import { read, readAll, create, update} from "../config/database.js";

export async function getCha(){
    try{
        return await readAll('chamados');
    } catch (err){
        console.error('Erro ao obter chamados:', err);
        throw err;
    }
}

export async function getTicket(id){
    try{
        return await read('chamados', `id = '${id}'`)
    } catch (err){
        console.error('Erro ao obter chamado:', err);
        throw err;
    }
}

export async function createTicket(data){
    try{
        return await create('chamados', data)
    } catch (err){
        console.error('Erro ao criar chamado:', err);
        throw err;
    }
}

export async function updateTicket(id, data){
    try{
        return await update('chamados', data, `id = '${id}'`)
    } catch (err){
        console.error('Erro ao atualizar chamado:', err);
        throw err;
    }
}
