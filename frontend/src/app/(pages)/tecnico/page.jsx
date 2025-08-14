"use client";

import { useState } from "react";
import SideBar from "../../Components/SideBar/SideBar.jsx";
import { Clock, CheckCircle, AlertTriangle, Search, Filter, BarChart2, Calendar, FileText } from "lucide-react";

export default function Tecnico() {
    const [activeTab, setActiveTab] = useState('chamadosPendentes');
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

    const chamados = [
        { id: 1001, titulo: "Problema com impressora", descricao: "A impressora da sala 302 não está funcionando corretamente.", usuario: "João Silva", departamento: "RH", prioridade: "Alta", status: "Pendente", data: "12/06/2023", categoria: "Suporte" },
        { id: 1002, titulo: "Computador não liga", descricao: "O computador da recepção não está ligando após queda de energia.", usuario: "Maria Oliveira", departamento: "Recepção", prioridade: "Alta", status: "Em Progresso", data: "13/06/2023", categoria: "Hardware" },
        { id: 1003, titulo: "Acesso ao sistema ERP", descricao: "Preciso de acesso ao módulo financeiro do sistema ERP.", usuario: "Carlos Santos", departamento: "Financeiro", prioridade: "Média", status: "Pendente", data: "14/06/2023", categoria: "Acesso" },
        { id: 1004, titulo: "Atualização de software", descricao: "Solicito atualização do pacote Office em minha máquina.", usuario: "Ana Pereira", departamento: "Marketing", prioridade: "Baixa", status: "Pendente", data: "15/06/2023", categoria: "Software" },
        { id: 1005, titulo: "Problema com internet", descricao: "A conexão com a internet está instável na sala de reuniões.", usuario: "Paulo Mendes", departamento: "Comercial", prioridade: "Média", status: "Resolvido", data: "16/06/2023", categoria: "Rede" },
    ];

    const handleChamadoClick = (chamado) => {
        setChamadoSelecionado(chamado);
    };

    const handleFecharDetalhes = () => {
        setChamadoSelecionado(null);
    };

    const handleAtualizarStatus = (novoStatus) => {
        // Aqui seria implementada a lógica para atualizar o status no backend
        console.log(`Atualizando chamado ${chamadoSelecionado.id} para status: ${novoStatus}`);
        setChamadoSelecionado({...chamadoSelecionado, status: novoStatus});
    };

    return (
        <div className="flex">
            <SideBar />
            
            <div className="flex-1 p-6 overflow-auto">
                {/* Cabeçalho da página */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Área do Técnico</h1>
                    <p className="text-gray-600">Gerencie os chamados técnicos</p>
                </div>

                {/* Cards de estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card p-6 flex items-center space-x-4 border-l-4 border-red-500">
                        <div className="rounded-full bg-red-100 p-3">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pendentes</p>
                            <h3 className="text-2xl font-bold text-gray-800">8</h3>
                        </div>
                    </div>

                    <div className="card p-6 flex items-center space-x-4 border-l-4 border-yellow-500">
                        <div className="rounded-full bg-yellow-100 p-3">
                            <Clock className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Em Progresso</p>
                            <h3 className="text-2xl font-bold text-gray-800">5</h3>
                        </div>
                    </div>

                    <div className="card p-6 flex items-center space-x-4 border-l-4 border-green-500">
                        <div className="rounded-full bg-green-100 p-3">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Resolvidos Hoje</p>
                            <h3 className="text-2xl font-bold text-gray-800">3</h3>
                        </div>
                    </div>
                </div>

                {/* Abas */}
                <div className="border-b mb-6">
                    <nav className="flex space-x-8">
                        <button 
                            onClick={() => setActiveTab('chamadosPendentes')} 
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'chamadosPendentes' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Chamados Pendentes
                        </button>
                        <button 
                            onClick={() => setActiveTab('emProgresso')} 
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'emProgresso' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Em Progresso
                        </button>
                        <button 
                            onClick={() => setActiveTab('resolvidos')} 
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'resolvidos' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Resolvidos
                        </button>
                    </nav>
                </div>

                {/* Conteúdo principal */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Lista de chamados */}
                    <div className={`${chamadoSelecionado ? 'lg:w-1/2' : 'w-full'} card p-6`}>
                        {/* Filtros e busca */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Buscar chamados..." 
                                    className="input-field pl-10"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Filter className="h-5 w-5 text-gray-500" />
                                <select className="input-field py-2">
                                    <option>Todas as prioridades</option>
                                    <option>Alta</option>
                                    <option>Média</option>
                                    <option>Baixa</option>
                                </select>
                            </div>
                        </div>

                        {/* Lista de chamados */}
                        <div className="space-y-4">
                            {chamados
                                .filter(chamado => {
                                    if (activeTab === 'chamadosPendentes') return chamado.status === 'Pendente';
                                    if (activeTab === 'emProgresso') return chamado.status === 'Em Progresso';
                                    if (activeTab === 'resolvidos') return chamado.status === 'Resolvido';
                                    return true;
                                })
                                .map(chamado => (
                                <div 
                                    key={chamado.id} 
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${chamadoSelecionado?.id === chamado.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'}`}
                                    onClick={() => handleChamadoClick(chamado)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-gray-800">{chamado.titulo}</h3>
                                        <div className={`px-2 py-1 text-xs rounded-full ${chamado.status === 'Pendente' ? 'bg-red-100 text-red-800' : chamado.status === 'Em Progresso' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {chamado.status}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{chamado.descricao}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <span className="flex items-center">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {chamado.data}
                                            </span>
                                            <span>#{chamado.id}</span>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full ${chamado.prioridade === 'Alta' ? 'bg-red-100 text-red-800' : chamado.prioridade === 'Média' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {chamado.prioridade}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detalhes do chamado */}
                    {chamadoSelecionado && (
                        <div className="lg:w-1/2 card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Detalhes do Chamado</h2>
                                <button 
                                    onClick={handleFecharDetalhes}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Cabeçalho do chamado */}
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-800">{chamadoSelecionado.titulo}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${chamadoSelecionado.status === 'Pendente' ? 'bg-red-100 text-red-800' : chamadoSelecionado.status === 'Em Progresso' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {chamadoSelecionado.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center">
                                            <FileText className="h-4 w-4 mr-1" />
                                            #{chamadoSelecionado.id}
                                        </span>
                                        <span className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {chamadoSelecionado.data}
                                        </span>
                                    </div>
                                </div>

                                {/* Informações do chamado */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-500">Solicitante</p>
                                        <p className="font-medium">{chamadoSelecionado.usuario}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Departamento</p>
                                        <p className="font-medium">{chamadoSelecionado.departamento}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Categoria</p>
                                        <p className="font-medium">{chamadoSelecionado.categoria}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Prioridade</p>
                                        <p className={`font-medium ${chamadoSelecionado.prioridade === 'Alta' ? 'text-red-600' : chamadoSelecionado.prioridade === 'Média' ? 'text-yellow-600' : 'text-green-600'}`}>
                                            {chamadoSelecionado.prioridade}
                                        </p>
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Descrição</h4>
                                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{chamadoSelecionado.descricao}</p>
                                </div>

                                {/* Ações */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Atualizar Status</h4>
                                    <div className="flex space-x-3">
                                        <button 
                                            onClick={() => handleAtualizarStatus('Pendente')} 
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${chamadoSelecionado.status === 'Pendente' ? 'bg-red-100 text-red-700 ring-1 ring-red-700' : 'text-red-700 hover:bg-red-50'}`}
                                        >
                                            Pendente
                                        </button>
                                        <button 
                                            onClick={() => handleAtualizarStatus('Em Progresso')} 
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${chamadoSelecionado.status === 'Em Progresso' ? 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-700' : 'text-yellow-700 hover:bg-yellow-50'}`}
                                        >
                                            Em Progresso
                                        </button>
                                        <button 
                                            onClick={() => handleAtualizarStatus('Resolvido')} 
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${chamadoSelecionado.status === 'Resolvido' ? 'bg-green-100 text-green-700 ring-1 ring-green-700' : 'text-green-700 hover:bg-green-50'}`}
                                        >
                                            Resolvido
                                        </button>
                                    </div>
                                </div>

                                {/* Adicionar comentário */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Adicionar Comentário</h4>
                                    <textarea 
                                        className="input-field" 
                                        rows="3" 
                                        placeholder="Digite seu comentário ou solução..."
                                    ></textarea>
                                    <div className="flex justify-end mt-2">
                                        <button className="btn btn-primary">Enviar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}