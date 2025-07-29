import { create, readAll, read, update, deleteRecord } from '../config/database.js';

const listarLivros = async () => {
  try {
    return await readAll('livros');
  } catch (error) {
    console.error('Erro ao listar livros:', error);
    throw error;
  }
};

const obterLivroPorId = async (id) => {
  try {
    return await read('livros', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter livro por ID:', error);
    throw error;
  }
};

const criarLivro = async (livroData) => {
  try {
    return await create('livros', livroData);
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    throw error;
  }
};

const atualizarLivro = async (id, livroData) => {
  try {
    await update('livros', livroData, `id = ${id}`);
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    throw error;
  }
};

const excluirLivro = async (id) => {
  try {
    await deleteRecord('livros', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    throw error;
  }
};

export { listarLivros, obterLivroPorId, criarLivro, atualizarLivro, excluirLivro };