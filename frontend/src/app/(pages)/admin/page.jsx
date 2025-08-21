"use client";

import { useState } from "react";
import { Users, BarChart2, PieChart, TrendingUp, Calendar, Settings, UserPlus, Briefcase, Search, Download, Filter, Layers, MessageSquare, CheckCircle, Clock, User } from "lucide-react";

export default function Admin() {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Dados simulados para o dashboard
    const estatisticas = {
        totalUsuarios: 120,
        totalTecnicos: 15,
        chamadosAbertos: 42,
        chamadosFechados: 156,
        tempoMedioResolucao: "4h 30min",
        satisfacaoMedia: 4.7
    };

    // Dados simulados para gráficos
    const chamadosPorDepartamento = [
        { departamento: "TI", quantidade: 45 },
        { departamento: "RH", quantidade: 23 },
        { departamento: "Financeiro", quantidade: 18 },
        { departamento: "Marketing", quantidade: 12 },
        { departamento: "Comercial", quantidade: 8 }
    ];

    const chamadosPorCategoria = [
        { categoria: "Hardware", quantidade: 38 },
        { categoria: "Software", quantidade: 52 },
        { categoria: "Rede", quantidade: 27 },
        { categoria: "Acesso", quantidade: 31 },
        { categoria: "Outros", quantidade: 8 }
    ];

    // Dados simulados para usuários
    const usuarios = [
        { id: 1, nome: "João Silva", email: "joao.silva@empresa.com", tipo: "Técnico", status: "Ativo" },
        { id: 2, nome: "Maria Oliveira", email: "maria.oliveira@empresa.com", tipo: "Usuário", status: "Ativo" },
        { id: 3, nome: "Carlos Santos", email: "carlos.santos@empresa.com", tipo: "Usuário", status: "Ativo" },
        { id: 4, nome: "Ana Pereira", email: "ana.pereira@empresa.com", tipo: "Usuário", status: "Inativo" },
        { id: 5, nome: "Paulo Mendes", email: "paulo.mendes@empresa.com", tipo: "Usuário", status: "Ativo" },
    ];

    // Dados simulados para departamentos
    const departamentos = [
        { id: 1, nome: "TI", responsavel: "João Silva", usuarios: 15, chamados: 45 },
        { id: 2, nome: "RH", responsavel: "Fernanda Lima", usuarios: 8, chamados: 23 },
        { id: 3, nome: "Financeiro", responsavel: "Roberto Alves", usuarios: 12, chamados: 18 },
        { id: 4, nome: "Marketing", responsavel: "Camila Costa", usuarios: 10, chamados: 12 },
        { id: 5, nome: "Comercial", responsavel: "Ricardo Gomes", usuarios: 14, chamados: 8 },
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Cabeçalho da página */}
            <header className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 shadow-md">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold">Painel Administrativo</h1>
                    <p className="text-red-100">Gerencie usuários, departamentos e visualize estatísticas</p>
                </div>
            </header>
            
            <div className="container mx-auto p-6 flex-1 overflow-auto">
                {/* Menu de navegação principal */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                    <nav className="flex flex-wrap gap-4">
                        <button 
                            onClick={() => setActiveTab('dashboard')} 
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'dashboard' ? 'bg-red-100 text-red-700 font-medium' : 'hover:bg-gray-100'}`}
                        >
                            <BarChart2 className="h-5 w-5" />
                            <span>Dashboard</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('usuarios')} 
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'usuarios' ? 'bg-yellow-100 text-yellow-700 font-medium' : 'hover:bg-gray-100'}`}
                        >
                            <Users className="h-5 w-5" />
                            <span>Usuários</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('relatorios')} 
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'relatorios' ? 'bg-green-100 text-green-700 font-medium' : 'hover:bg-gray-100'}`}
                        >
                            <PieChart className="h-5 w-5" />
                            <span>Relatórios</span>
                        </button>
                    </nav>
                </div>

                {/* Conteúdo das abas */}
                {activeTab === 'dashboard' && (
                    <div>
                        {/* Cards de estatísticas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="card p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Usuários</h3>
                                    <div className="rounded-full bg-blue-100 p-3">
                                        <Users className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Total de Usuários</p>
                                        <p className="text-2xl font-bold text-gray-800">{estatisticas.totalUsuarios}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Técnicos</p>
                                        <p className="text-2xl font-bold text-gray-800">{estatisticas.totalTecnicos}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Chamados</h3>
                                    <div className="rounded-full bg-red-100 p-3">
                                        <BarChart2 className="h-6 w-6 text-red-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Abertos</p>
                                        <p className="text-2xl font-bold text-gray-800">{estatisticas.chamadosAbertos}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Fechados</p>
                                        <p className="text-2xl font-bold text-gray-800">{estatisticas.chamadosFechados}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Desempenho</h3>
                                    <div className="rounded-full bg-green-100 p-3">
                                        <TrendingUp className="h-6 w-6 text-green-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Tempo Médio</p>
                                        <p className="text-2xl font-bold text-gray-800">{estatisticas.tempoMedioResolucao}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Satisfação</p>
                                        <p className="text-2xl font-bold text-gray-800">{estatisticas.satisfacaoMedia}/5</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gráficos */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <BarChart2 className="h-5 w-5 mr-2 text-blue-600" />
                                    Chamados por Departamento
                                </h3>
                                <div className="h-64 flex items-end justify-between">
                                    {chamadosPorDepartamento.map((item, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                            <div 
                                                className="w-12 bg-red-500 rounded-t-md" 
                                                style={{ height: `${(item.quantidade / 45) * 180}px` }}
                                            ></div>
                                            <p className="text-xs text-gray-600 mt-2">{item.departamento}</p>
                                            <p className="text-sm font-medium">{item.quantidade}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Chamados por Categoria</h3>
                                <div className="h-64 flex items-center justify-center">
                                    <div className="relative h-40 w-40 rounded-full border-8 border-gray-100 flex items-center justify-center">
                                        <div className="absolute inset-0 h-full w-full">
                                            {/* Simulação visual de um gráfico de pizza */}
                                            <div className="absolute inset-0 h-full w-full rounded-full overflow-hidden">
                                                <div className="absolute top-0 left-0 h-1/2 w-1/2 bg-red-500 origin-bottom-right transform rotate-0"></div>
                                                <div className="absolute top-0 right-0 h-1/2 w-1/2 bg-blue-500 origin-bottom-left transform rotate-0"></div>
                                                <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-yellow-500 origin-top-right transform rotate-0"></div>
                                                <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-green-500 origin-top-left transform rotate-0"></div>
                                            </div>
                                        </div>
                                        <div className="z-10 bg-white h-24 w-24 rounded-full flex items-center justify-center">
                                            <p className="text-sm font-medium text-gray-600">Total: 156</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 mt-4">
                                    {chamadosPorCategoria.map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className={`h-3 w-3 rounded-full mr-2 ${
                                                index === 0 ? 'bg-red-500' : 
                                                index === 1 ? 'bg-blue-500' : 
                                                index === 2 ? 'bg-yellow-500' : 
                                                index === 3 ? 'bg-green-500' : 'bg-gray-500'
                                            }`}></div>
                                            <span className="text-xs text-gray-600">{item.categoria}: {item.quantidade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Calendário de atividades */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Calendário de Atividades</h3>
                                <button className="text-sm text-red-600 hover:text-red-800 font-medium">Ver todos</button>
                            </div>
                            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                                <Calendar className="h-16 w-16 text-gray-400" />
                                <p className="text-gray-500 ml-4">O calendário de atividades estará disponível em breve.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'usuarios' && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                            <Users className="h-5 w-5 mr-2 text-yellow-600" />
                            Gerenciamento de Usuários
                        </h2>
                        
                        {/* Filtros e busca */}
                        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Buscar usuários..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700"

                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                            <div className="w-auto flex space-x-3">
                                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-500">

                                    <Download className="h-4 w-4 text-gray-500" />
                                    <span>Exportar</span>
                                </button>
                                <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                                    <UserPlus className="h-4 w-4" />
                                    <span>Novo Usuário</span>
                                </button>
                            </div>
                        </div>

                        {/* Filtros e busca */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <select className="input-field py-2 text-gray-500">

                                <option>Todos os tipos</option>
                                <option>Usuário</option>
                                <option>Técnico</option>
                                <option>Administrador</option>
                            </select>
                        </div>

                        {/* Lista de usuários */}
                        <div className="space-y-4">
                            {usuarios.map((usuario) => (
                                <div key={usuario.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-800">{usuario.nome}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{usuario.email}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${usuario.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {usuario.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${usuario.tipo === 'Técnico' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                            {usuario.tipo}
                                        </span>
                                        <div>
                                            <button className="text-blue-600 hover:text-blue-900 mr-3 text-sm font-medium flex items-center">
                                                <Settings className="h-3 w-3 mr-1" />
                                                Editar
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center">
                                                <User className="h-3 w-3 mr-1" />
                                                Desativar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Paginação */}
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">1</span> a <span className="font-medium">5</span> de <span className="font-medium">120</span> resultados
                            </div>
                            <div className="flex space-x-2">
                                <button className="btn btn-outline py-1 px-3">Anterior</button>
                                <button className="btn btn-primary py-1 px-3">Próximo</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'relatorios' && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                            <PieChart className="h-5 w-5 mr-2 text-green-600" />
                            Relatórios e Análises
                        </h2>
                        
                        {/* Filtros e busca */}
                        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Filtrar relatórios..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                            <div className="w-auto">
                                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                    <Download className="h-4 w-4 text-gray-500" />
                                    <span>Exportar</span>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4 mx-auto">
                                    <BarChart2 className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-medium text-center mb-2">Chamados por Status</h3>
                                <p className="text-sm text-gray-600 text-center mb-4">Visualize a distribuição de chamados por status atual.</p>
                                <button className="w-full py-2 px-4 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors">Gerar Relatório</button>
                            </div>

                            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4 mx-auto">
                                    <Clock className="h-8 w-8 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-medium text-center mb-2">Tempo Médio de Resolução</h3>
                                <p className="text-sm text-gray-600 text-center mb-4">Analise o tempo médio de resolução por categoria e técnico.</p>
                                <button className="w-full py-2 px-4 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors">Gerar Relatório</button>
                            </div>

                            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4 mx-auto">
                                    <Users className="h-8 w-8 text-yellow-500" />
                                </div>
                                <h3 className="text-lg font-medium text-center mb-2">Chamados por Técnico</h3>
                                <p className="text-sm text-gray-600 text-center mb-4">Compare o desempenho e volume de chamados por técnico.</p>
                                <button className="w-full py-2 px-4 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors">Gerar Relatório</button>
                            </div>

                            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 mx-auto">
                                    <PieChart className="h-8 w-8 text-green-500" />
                                </div>
                                <h3 className="text-lg font-medium text-center mb-2">Chamados por Categoria</h3>
                                <p className="text-sm text-gray-600 text-center mb-4">Analise a distribuição de chamados por categoria e tipo.</p>
                                <button className="w-full py-2 px-4 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors">Gerar Relatório</button>
                            </div>
                        </div>
                    </div>
                )}

    
            </div>
        </div>
    );
}