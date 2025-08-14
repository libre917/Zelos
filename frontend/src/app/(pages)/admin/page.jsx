"use client";

import { useState } from "react";
import SideBar from "../../Components/SideBar/SideBar.jsx";
import { Users, BarChart2, PieChart, TrendingUp, Calendar, Settings, UserPlus, Briefcase, Search, Download, Filter } from "lucide-react";

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
        { id: 1, nome: "João Silva", email: "joao.silva@empresa.com", departamento: "TI", tipo: "Técnico", status: "Ativo" },
        { id: 2, nome: "Maria Oliveira", email: "maria.oliveira@empresa.com", departamento: "RH", tipo: "Usuário", status: "Ativo" },
        { id: 3, nome: "Carlos Santos", email: "carlos.santos@empresa.com", departamento: "Financeiro", tipo: "Usuário", status: "Ativo" },
        { id: 4, nome: "Ana Pereira", email: "ana.pereira@empresa.com", departamento: "Marketing", tipo: "Usuário", status: "Inativo" },
        { id: 5, nome: "Paulo Mendes", email: "paulo.mendes@empresa.com", departamento: "Comercial", tipo: "Usuário", status: "Ativo" },
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
        <div className="flex">
            <SideBar />
            
            <div className="flex-1 p-6 overflow-auto">
                {/* Cabeçalho da página */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
                    <p className="text-gray-600">Gerencie usuários, departamentos e visualize estatísticas</p>
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
                            onClick={() => setActiveTab('usuarios')} 
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'usuarios' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Usuários
                        </button>
                        <button 
                            onClick={() => setActiveTab('departamentos')} 
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'departamentos' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Departamentos
                        </button>
                        <button 
                            onClick={() => setActiveTab('relatorios')} 
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'relatorios' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Relatórios
                        </button>
                        <button 
                            onClick={() => setActiveTab('configuracoes')} 
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'configuracoes' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Configurações
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

                            <div className="card p-6">
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

                            <div className="card p-6">
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
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Chamados por Departamento</h3>
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

                            <div className="card p-6">
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
                    <div>
                        {/* Cabeçalho com ações */}
                        <div className="flex flex-wrap justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Gerenciamento de Usuários</h2>
                            <div className="flex space-x-3">
                                <button className="btn btn-outline flex items-center space-x-2">
                                    <Download className="h-4 w-4" />
                                    <span>Exportar</span>
                                </button>
                                <button className="btn btn-primary flex items-center space-x-2">
                                    <UserPlus className="h-4 w-4" />
                                    <span>Novo Usuário</span>
                                </button>
                            </div>
                        </div>

                        {/* Filtros e busca */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Buscar usuários..." 
                                    className="input-field pl-10"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Filter className="h-5 w-5 text-gray-500" />
                                <select className="input-field py-2">
                                    <option>Todos os departamentos</option>
                                    <option>TI</option>
                                    <option>RH</option>
                                    <option>Financeiro</option>
                                    <option>Marketing</option>
                                    <option>Comercial</option>
                                </select>
                            </div>
                            <select className="input-field py-2">
                                <option>Todos os tipos</option>
                                <option>Usuário</option>
                                <option>Técnico</option>
                                <option>Administrador</option>
                            </select>
                        </div>

                        {/* Tabela de usuários */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {usuarios.map((usuario) => (
                                        <tr key={usuario.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{usuario.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.nome}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.departamento}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.tipo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${usuario.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {usuario.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-red-600 hover:text-red-900 mr-3">Editar</button>
                                                <button className="text-gray-600 hover:text-gray-900">Desativar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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

                {activeTab === 'departamentos' && (
                    <div>
                        {/* Cabeçalho com ações */}
                        <div className="flex flex-wrap justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Gerenciamento de Departamentos</h2>
                            <button className="btn btn-primary flex items-center space-x-2">
                                <Briefcase className="h-4 w-4" />
                                <span>Novo Departamento</span>
                            </button>
                        </div>

                        {/* Lista de departamentos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {departamentos.map((departamento) => (
                                <div key={departamento.id} className="card p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">{departamento.nome}</h3>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <Settings className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">Responsável: {departamento.responsavel}</p>
                                    <div className="flex justify-between text-sm">
                                        <div>
                                            <p className="text-gray-500">Usuários</p>
                                            <p className="font-medium">{departamento.usuarios}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Chamados</p>
                                            <p className="font-medium">{departamento.chamados}</p>
                                        </div>
                                        <div>
                                            <button className="text-red-600 hover:text-red-800">Editar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'relatorios' && (
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Relatórios</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4 mx-auto">
                                    <BarChart2 className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-medium text-center mb-2">Chamados por Período</h3>
                                <p className="text-sm text-gray-600 text-center mb-4">Visualize a quantidade de chamados abertos e fechados por período.</p>
                                <button className="w-full btn btn-outline">Gerar Relatório</button>
                            </div>

                            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4 mx-auto">
                                    <PieChart className="h-8 w-8 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-medium text-center mb-2">Chamados por Categoria</h3>
                                <p className="text-sm text-gray-600 text-center mb-4">Analise a distribuição de chamados por categoria e tipo.</p>
                                <button className="w-full btn btn-outline">Gerar Relatório</button>
                            </div>

                            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 mx-auto">
                                    <TrendingUp className="h-8 w-8 text-green-500" />
                                </div>
                                <h3 className="text-lg font-medium text-center mb-2">Desempenho da Equipe</h3>
                                <p className="text-sm text-gray-600 text-center mb-4">Avalie o desempenho da equipe técnica e tempos de resolução.</p>
                                <button className="w-full btn btn-outline">Gerar Relatório</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'configuracoes' && (
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Configurações do Sistema</h2>
                        
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Configurações Gerais</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                                        <input type="text" className="input-field" value="SENAI" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contato</label>
                                        <input type="email" className="input-field" value="contato@senai.com.br" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fuso Horário</label>
                                        <select className="input-field">
                                            <option>America/Sao_Paulo (GMT-3)</option>
                                            <option>America/New_York (GMT-5)</option>
                                            <option>Europe/London (GMT+0)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Configurações de Chamados</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="auto_assign" className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" checked />
                                        <label htmlFor="auto_assign" className="ml-2 block text-sm text-gray-700">Atribuir chamados automaticamente</label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tempo máximo para primeira resposta (horas)</label>
                                        <input type="number" className="input-field" value="4" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categorias de Chamados</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">Hardware</span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">Software</span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">Rede</span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">Acesso</span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">Outros</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <input type="text" className="input-field" placeholder="Nova categoria" />
                                            <button className="btn btn-outline">Adicionar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Notificações</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="email_notif" className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" checked />
                                        <label htmlFor="email_notif" className="ml-2 block text-sm text-gray-700">Notificações por email</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="system_notif" className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" checked />
                                        <label htmlFor="system_notif" className="ml-2 block text-sm text-gray-700">Notificações no sistema</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="daily_digest" className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                                        <label htmlFor="daily_digest" className="ml-2 block text-sm text-gray-700">Resumo diário de atividades</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-8 space-x-3">
                            <button className="btn btn-outline">Cancelar</button>
                            <button className="btn btn-primary">Salvar Alterações</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}