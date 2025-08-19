"use client";

import { useState, useEffect } from "react";
import SideBarUsuario from "../../Components/SideBarUsuario/SideBarUsuario.jsx";

import { PlusCircle, FileText, Paperclip, Search, Filter, Calendar } from "lucide-react";

export default function Usuario() {
    const [activeTab, setActiveTab] = useState('criarChamado');

    return (
        <div className="flex">
            <SideBarUsuario />

            
            <div className="flex-1 p-6 overflow-auto">
                {/* Cabeçalho da página */}
                <div className="mb-8 bg-gradient-to-r from-red-50 to-white p-6 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-800">Área do Usuário</h1>
                    <p className="text-gray-600 mt-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date().toLocaleDateString('pt-BR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
                    </p>
                </div>

                {/* Abas */}
                <div className="mb-6">
                    <nav className="flex space-x-4">
                        <button 
                            onClick={() => setActiveTab('criarChamado')} 
                            className={`py-3 px-6 rounded-lg font-medium text-sm flex items-center ${activeTab === 'criarChamado' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Criar Chamado
                        </button>
                        <button 
                            onClick={() => setActiveTab('meusChamados')} 
                            className={`py-3 px-6 rounded-lg font-medium text-sm flex items-center ${activeTab === 'meusChamados' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Meus Chamados
                        </button>
                    </nav>
                </div>

                {/* Conteúdo das abas */}
                {activeTab === 'criarChamado' && (
                    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-l-4 border-red-500 pl-3">Criar Novo Chamado</h2>
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
                                        className="input-field text-gray-700"

                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoria
                                    </label>
                                    <select className="input-field text-gray-700">

                                        <option>Selecione uma categoria</option>
                                        <option>Infraestrutura</option>
                                        <option>Suporte</option>
                                        <option>Desenvolvimento</option>
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
                                    className="input-field text-gray-700"

                                ></textarea>
                            </div>

                            {/* Botões */}
                            <div className="flex justify-end space-x-3">
                                <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center space-x-2">
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Criar Chamado</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'meusChamados' && (
                    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-l-4 border-red-500 pl-3">Meus Chamados</h2>
                        
                        {/* Filtros */}
                        <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                            <div className="relative max-w-xs">
                                <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 max-w-xs text-gray-700">
                                    <option>Todos os status</option>
                                    <option>Pendente</option>
                                    <option>Em Progresso</option>
                                    <option>Resolvido</option>
                                </select>
                            </div>
                            
                            <div className="relative max-w-xs">
                                <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 max-w-xs text-gray-700">
                                    <option>Todas as categorias</option>
                                    <option>Infraestrutura</option>
                                    <option>Suporte</option>
                                    <option>Desenvolvimento</option>
                                </select>
                            </div>
                            
                            <div className="flex-grow relative">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Buscar chamados..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 w-full text-gray-700" />
                            </div>
                        </div>
                        
                        {/* Tabela de chamados */}
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                        <div className="flex items-center justify-between mt-6 bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-700 flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-red-500" />
                                Nenhum chamado encontrado
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}