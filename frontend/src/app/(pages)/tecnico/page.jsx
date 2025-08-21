"use client";

import { useState } from "react";

import { Clock, CheckCircle, AlertTriangle, Search, Filter, BarChart2, Calendar, FileText, Layers, MessageSquare, Settings, User } from "lucide-react";

export default function Tecnico() {
    const [activeTab, setActiveTab] = useState('pool');
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
    const [chamados, setChamados] = useState([
        { id: 1001, titulo: "Problema com impressora", descricao: "A impressora da sala 302 não está funcionando corretamente.", usuario: "João Silva", status: "Pendente", data: "12/06/2023", categoria: "Suporte", tecnico: null },
        { id: 1002, titulo: "Computador não liga", descricao: "O computador da recepção não está ligando após queda de energia.", usuario: "Maria Oliveira", status: "Em Progresso", data: "13/06/2023", categoria: "Hardware", tecnico: "Técnico 1" },
        { id: 1003, titulo: "Acesso ao sistema ERP", descricao: "Preciso de acesso ao módulo financeiro do sistema ERP.", usuario: "Carlos Santos", status: "Pendente", data: "14/06/2023", categoria: "Acesso", tecnico: null },
        { id: 1004, titulo: "Atualização de software", descricao: "Solicito atualização do pacote Office em minha máquina.", usuario: "Ana Pereira", status: "Pendente", data: "15/06/2023", categoria: "Software", tecnico: null },
        { id: 1005, titulo: "Problema com internet", descricao: "A conexão com a internet está instável na sala de reuniões.", usuario: "Paulo Mendes", status: "Resolvido", data: "16/06/2023", categoria: "Rede", tecnico: "Técnico 1" },
    ]);
    const nomeTecnico = "Técnico 1"; // Simulação do nome do técnico logado

    const handleChamadoClick = (chamado) => {
        setChamadoSelecionado(chamado);
    };

    const handleFecharDetalhes = () => {
        setChamadoSelecionado(null);
    };


    const handleAtualizarStatus = (novoStatus) => {
        // Atualiza o status do chamado selecionado
        setChamados(prev => prev.map(c =>
            c.id === chamadoSelecionado.id ? { ...c, status: novoStatus } : c
        ));
        setChamadoSelecionado({...chamadoSelecionado, status: novoStatus});
    };

    // Candidatar-se ao chamado
    const handleCandidatar = () => {
        setChamados(prev => prev.map(c =>
            c.id === chamadoSelecionado.id ? { ...c, status: "Em Progresso", tecnico: nomeTecnico } : c
        ));
        setChamadoSelecionado({...chamadoSelecionado, status: "Em Progresso", tecnico: nomeTecnico });
        setActiveTab('emProgresso');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Cabeçalho da página */}
            <header className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 shadow-md">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold">Área do Técnico</h1>
                    <p className="text-red-100">Gerencie os chamados técnicos de forma eficiente</p>
                </div>
            </header>
            
            <div className="container mx-auto p-6 flex-1 overflow-auto">
                {/* Menu de navegação principal */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                    <nav className="flex flex-wrap gap-4">
                        <button 
                            onClick={() => setActiveTab('pool')} 
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'pool' ? 'bg-red-100 text-red-700 font-medium' : 'hover:bg-gray-100'}`}

                        >
                            <Layers className="h-5 w-5" />
                            <span>Pool de Chamados</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('emProgresso')} 
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'emProgresso' ? 'bg-yellow-100 text-yellow-700 font-medium' : 'hover:bg-gray-100'}`}

                        >
                            <Clock className="h-5 w-5" />
                            <span>Em Progresso</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('resolvidos')} 
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'resolvidos' ? 'bg-green-100 text-green-700 font-medium' : 'hover:bg-gray-100'}`}

                        >
                            <CheckCircle className="h-5 w-5" />
                            <span>Resolvidos</span>
                        </button>
                    </nav>
                </div>

                {/* Área de Pool de Chamados, Em Progresso e Resolvidos */}
                {(activeTab === 'pool' || activeTab === 'emProgresso' || activeTab === 'resolvidos') && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                            {activeTab === 'pool' && <Layers className="h-5 w-5 mr-2 text-red-600" />}
                            {activeTab === 'emProgresso' && <Clock className="h-5 w-5 mr-2 text-yellow-600" />}
                            {activeTab === 'resolvidos' && <CheckCircle className="h-5 w-5 mr-2 text-green-600" />}
                            {activeTab === 'pool' && 'Pool de Chamados'}
                            {activeTab === 'emProgresso' && 'Chamados Em Progresso'}
                            {activeTab === 'resolvidos' && 'Chamados Resolvidos'}
                        </h2>
                        
                        {/* Filtros e busca */}
                        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                                        <option value="">Todas as categorias</option>
                                        <option value="Hardware">Hardware</option>
                                        <option value="Software">Software</option>
                                        <option value="Rede">Rede</option>
                                        <option value="Acesso">Acesso</option>
                                        <option value="Suporte">Suporte</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        {/* Conteúdo principal */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Lista de chamados */}
                            <div className={`${chamadoSelecionado ? 'lg:w-1/2' : 'w-full'} bg-white rounded-lg border border-gray-200`}>

                                {/* Lista de chamados */}
                                <div className="space-y-4 p-4">
                                    {chamados
                                        .filter(chamado => {
                                            if (activeTab === 'pool') return chamado.status === 'Pendente' && !chamado.tecnico;
                                            if (activeTab === 'chamadosPendentes') return chamado.status === 'Pendente' && chamado.tecnico === nomeTecnico;
                                            if (activeTab === 'emProgresso') return chamado.status === 'Em Progresso' && chamado.tecnico === nomeTecnico;
                                            if (activeTab === 'resolvidos') return chamado.status === 'Resolvido' && chamado.tecnico === nomeTecnico;
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
                                    </div>
                                </div>
                                    ))}
                                </div>
                            </div>

                            {/* Detalhes do chamado */}
                            {chamadoSelecionado && (
                                <div className="lg:w-1/2 bg-white rounded-lg border border-gray-200 p-6">
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
                                        <p className="font-medium text-gray-700">{chamadoSelecionado.usuario}</p>

                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Categoria</p>
                                        <p className="font-medium text-gray-700">{chamadoSelecionado.categoria}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500"></p>
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Descrição</h4>
                                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{chamadoSelecionado.descricao}</p>
                                </div>

                                {/* Ações */}
                                <div>
                                    {activeTab === 'pool' && chamadoSelecionado.status === 'Pendente' && !chamadoSelecionado.tecnico ? (
                                        <button 
                                            onClick={handleCandidatar}
                                            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                                        >
                                            Candidatar-se ao Chamado
                                        </button>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
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
                )}
            </div>
        </div>
    );
}