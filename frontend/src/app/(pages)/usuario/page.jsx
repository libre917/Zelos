"use client";

import { useState } from "react";
import SideBar from "../../Components/SideBar/SideBar.jsx";
import { PlusCircle, FileText, Paperclip } from "lucide-react";

export default function Usuario() {
    const [activeTab, setActiveTab] = useState('criarChamado');

    return (
        <div className="flex">
            <SideBar />
            
            <div className="flex-1 p-6 overflow-auto">
                {/* Cabeçalho da página */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Área do Usuário</h1>
                    <p className="text-gray-600">Gerencie seus chamados</p>
                </div>

                {/* Abas */}
                <div className="border-b mb-6">
                    <nav className="flex space-x-8">
                        <button 
                            onClick={() => setActiveTab('criarChamado')} 
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'criarChamado' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Criar Chamado
                        </button>
                        <button 
                            onClick={() => setActiveTab('meusChamados')} 
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'meusChamados' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Meus Chamados
                        </button>
                    </nav>
                </div>

                {/* Conteúdo das abas */}
                {activeTab === 'criarChamado' && (
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Criar Novo Chamado</h2>
                        <form>
                            {/* Linha 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Título do Chamado
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Digite o título do chamado"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoria
                                    </label>
                                    <select className="input-field">
                                        <option>Selecione uma categoria</option>
                                        <option>Infraestrutura</option>
                                        <option>Suporte</option>
                                        <option>Desenvolvimento</option>
                                    </select>
                                </div>
                            </div>

                            {/* Linha 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Prioridade
                                    </label>
                                    <select className="input-field">
                                        <option>Baixa</option>
                                        <option>Média</option>
                                        <option>Alta</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Departamento
                                    </label>
                                    <select className="input-field">
                                        <option>TI</option>
                                        <option>RH</option>
                                        <option>Financeiro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Descrição */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descrição
                                </label>
                                <textarea
                                    placeholder="Descreva detalhadamente o problema ou solicitação"
                                    rows={4}
                                    className="input-field"
                                ></textarea>
                            </div>

                            {/* Anexos
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Anexos
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500">
                                                <span>Carregar um arquivo</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1">ou arraste e solte</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, PDF até 10MB</p>
                                    </div>
                                </div>
                            </div> */}

                            {/* Botões */}
                            <div className="flex justify-end space-x-3">
                                <button type="button" className="btn btn-outline">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary flex items-center space-x-2">
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Criar Chamado</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'meusChamados' && (
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Meus Chamados</h2>
                        
                        {/* Filtros */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <select className="input-field max-w-xs">
                                <option>Todos os status</option>
                                <option>Pendente</option>
                                <option>Em Progresso</option>
                                <option>Resolvido</option>
                            </select>
                            
                            <select className="input-field max-w-xs">
                                <option>Todas as categorias</option>
                                <option>Infraestrutura</option>
                                <option>Suporte</option>
                                <option>Desenvolvimento</option>
                            </select>
                            
                            <div className="flex-grow">
                                <input type="text" placeholder="Buscar chamados..." className="input-field" />
                            </div>
                        </div>
                        
                        {/* Tabela de chamados */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Tabela vazia - nenhum chamado encontrado */}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Paginação */}
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-700">
                                Nenhum chamado encontrado
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}