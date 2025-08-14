"use client";

import { useState } from "react";
import SideBar from "../../Components/SideBar/SideBar.jsx";
import { PlusCircle, Clock, AlertTriangle, CheckCircle, BarChart2, Calendar, FileText, Paperclip } from "lucide-react";

export default function Usuario() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="flex">
            <SideBar />
            
            <div className="flex-1 p-6 overflow-auto">
                {/* Cabeçalho da página */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600">Bem-vindo ao seu painel de controle</p>
                </div>

                {/* Cards de estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card p-6 flex items-center space-x-4 border-l-4 border-red-500">
                        <div className="rounded-full bg-red-100 p-3">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pendentes</p>
                            <h3 className="text-2xl font-bold text-gray-800">5</h3>
                        </div>
                    </div>

                    <div className="card p-6 flex items-center space-x-4 border-l-4 border-yellow-500">
                        <div className="rounded-full bg-yellow-100 p-3">
                            <Clock className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Em Progresso</p>
                            <h3 className="text-2xl font-bold text-gray-800">3</h3>
                        </div>
                    </div>

                    <div className="card p-6 flex items-center space-x-4 border-l-4 border-green-500">
                        <div className="rounded-full bg-green-100 p-3">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Resolvidos</p>
                            <h3 className="text-2xl font-bold text-gray-800">12</h3>
                        </div>
                    </div>

                    <div className="card p-6 flex items-center space-x-4 border-l-4 border-blue-500">
                        <div className="rounded-full bg-blue-100 p-3">
                            <BarChart2 className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <h3 className="text-2xl font-bold text-gray-800">20</h3>
                        </div>
                    </div>
                </div>

                {/* Abas */}
                <div className="border-b mb-6">
                    <nav className="flex space-x-8">
                        <button 
                            onClick={() => setActiveTab('dashboard')} 
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'dashboard' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Dashboard
                        </button>
                        <button 
                            onClick={() => setActiveTab('novoChamado')} 
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'novoChamado' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Novo Chamado
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
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Chamados recentes */}
                        <div className="lg:col-span-2 card p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Chamados Recentes</h2>
                            <div className="space-y-4">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-800">Problema com impressora</h3>
                                                <p className="text-sm text-gray-600 mt-1">A impressora da sala 302 não está funcionando corretamente.</p>
                                                <div className="flex items-center mt-2 space-x-4 text-xs">
                                                    <span className="flex items-center text-gray-500">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        12/06/2023
                                                    </span>
                                                    <span className="flex items-center text-gray-500">
                                                        <FileText className="h-3 w-3 mr-1" />
                                                        #CH-{1000 + item}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Em Progresso</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-4 text-sm text-red-600 hover:text-red-800 font-medium">Ver todos os chamados</button>
                        </div>

                        {/* Atividades recentes */}
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Atividades Recentes</h2>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div key={item} className="flex items-start space-x-3">
                                        <div className="relative mt-1">
                                            <div className="h-2 w-2 rounded-full bg-red-500 ring-4 ring-red-100"></div>
                                            {item !== 5 && <div className="absolute top-2 bottom-0 left-1 -ml-px w-0.5 bg-gray-200"></div>}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800">Chamado #{1000 + item} atualizado</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Há {item} hora{item !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'novoChamado' && (
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

                            {/* Anexos */}
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
                            </div>

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
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <tr key={item} className="hover:bg-gray-50 cursor-pointer">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{1000 + item}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Problema com impressora</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Suporte</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${item % 3 === 0 ? 'bg-green-100 text-green-800' : item % 3 === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {item % 3 === 0 ? 'Resolvido' : item % 3 === 1 ? 'Em Progresso' : 'Pendente'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12/06/2023</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Paginação */}
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">1</span> a <span className="font-medium">5</span> de <span className="font-medium">20</span> resultados
                            </div>
                            <div className="flex space-x-2">
                                <button className="btn btn-outline py-1 px-3">Anterior</button>
                                <button className="btn btn-primary py-1 px-3">Próximo</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}