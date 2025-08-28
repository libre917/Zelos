'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
    Users,
    PlusCircle,
    BarChart2,
    PieChart,
    TrendingUp,
    Calendar,
    Settings,
    UserPlus,
    Briefcase,
    Search,
    Download,
    Filter,
    Layers,
    MessageSquare,
    CheckCircle,
    Clock,
    User,
    FileText,
    Send
} from 'lucide-react';
import { API } from '../../../config/routes';

export default function Admin() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showUserModal, setShowUserModal] = useState(false);
    const [reload, setReload] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [categoriasChamados, setCategoriasChamados] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');

    // Estados para formulário de categoria
    const [categoriaNome, setCategoriaNome] = useState('');
    const [categoriaDescricao, setCategoriaDescricao] = useState('');

    // Estados para a lista de usuários e filtros
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Todos'); // 'Todos', 'Usuário', 'Técnico', 'Administrador'
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        funcao: '',
        status: 'Ativo',
    });
    const [formChamadoData, setFormChamadoData] = useState({
        equipamentoId: '',
        categoria: '',
        descricao: '',
    });

    const [canCreate, setCanCreate] = useState(false);

    // carrega categorias
    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) router.push('/');
        (async () => {
            try {
                const response = await fetch(API.POOL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    console.error('Erro ao buscar categorias:', response.status);
                    return;
                }

                const categorias = await response.json();

                setCategorias(categorias);
            } catch (err) {
                console.error('Erro na requisição:', err);
            }
        })();
    }, [reload]);

    //busca os usuários
    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) router.push('/');

        (async () => {
            try {
                const response = await fetch(API.USERS, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error('Erro ao buscar usuarios:', response.status);
                    return;
                }

                const data = await response.json();
                setUsuarios(data);
            } catch (err) {
                console.error('Erro na requisição:', err);
            } finally {
                setLoadingUsers(false);
            }
        })();
    }, [reload]);

    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) router.push('/');
        (async () => {
            try {
                const response = await fetch(API.GET_POOL_WITH_TICKETS, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    console.error('Erro ao buscar pools:', response.status);
                    return;
                }
                const data = await response.json();
                setCategoriasChamados(data);
            } catch (err) {
                console.error('Erro na requisição:', err);
                alert('Erro na requisição, por favor, tente novamente.');
            }
        })();
    }, [reload]);

    // função para criar usuário
    async function createUser() {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) router.push('/');
        setCanCreate(false);
        try {
            const response = await fetch(API.USERS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    funcao: formData.funcao,
                    status: formData.status,
                }),
            });

            if (!response.ok) {
                const res = await response.json();
                console.error('Erro ao cadastrar usuário:', response.status);
                alert(res.mensagem);
                setFormData({
                    nome: '',
                    email: '',
                    senha: '',
                    tipo: '',
                    status: 'Ativo',
                });

                return;
            }
            alert(`Usuário ${formData.nome} foi cadastrado com sucesso!`);
            setShowUserModal(false);
            const data = await response.json();
            setReload(!reload);
            setUsuarios((prev) => [...prev, data]);
            setFormData({
                nome: '',
                email: '',
                senha: '',
                tipo: '',
                status: 'Ativo',
            });
        } catch (err) {
            console.error('Erro na requisição:', err);
        } finally {
            setLoadingUsers(false);
        }
    }
    // aciona função se canCreate for verdadeiro
    if (canCreate === true) {
        createUser();
    }
    async function criarCategoria() {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            router.push('/');
            return;
        }

        try {
            const response = await fetch(API.POOL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    titulo: categoriaNome,
                    descricao: categoriaDescricao,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao criar categoria:', response.status, errorData);
                alert(`Erro ao criar categoria: ${errorData.mensagem}`);
                return;
            }

            setCategoriaNome('');
            setCategoriaDescricao('');
            setReload(!reload);
            alert('Categoria criada com sucesso!');
        } catch (err) {
            console.error('Erro na requisição:', err);
            alert('Erro na requisição, por favor, tente novamente.');
        }
    }

    async function updataStatus(id, newStatus) {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) router.push('/');
        setCanCreate(false);

        try {
            const response = await fetch(API.CHANGE_STATUS_USER(id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                console.error('Erro ao cadastrar usuário:', response.status);
                return;
            }
            setReload(!reload);
        } catch (err) {
            console.error('Erro na requisição:', err);
        }
    }

    function GraficoDeChamados({ data }) {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#d88484ff" />
                </BarChart>
            </ResponsiveContainer>
        );
    }

    // Dados simulados para o dashboard
    const estatisticas = {
        totalUsuarios: usuarios.filter((user) => user.funcao === 'usuario').length,
        totalAdmins: usuarios.filter((user) => user.funcao === 'admin').length,
        totaladmins: usuarios.filter((user) => user.funcao === 'admin').length,
        chamadosAbertos: chamados.filter((chamado) => chamado.status === 'pendente').length,
        chamadosFechados: chamados.filter((chamado) => chamado.status === 'concluido').length,
        chamadosEmProgresso: chamados.filter((chamado) => chamado.status === 'em progresso').length,
    };
    const chamadosPorCategoria = categoriasChamados;

    // Lógica de filtragem dos usuários

    const filteredUsers = usuarios.filter((usuario) => {
        if (usuario.nome) {
            const nameMatch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase());
            const typeMatch = filterType === 'Todos' || usuario.funcao.toLowerCase() === filterType.toLowerCase();
            return nameMatch && typeMatch;
        }
    });

    // Função para lidar com mudanças no formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleInputChangeCategoria = (e) => {
        const { name, value } = e.target;
        if (name === 'categoriaNome') setCategoriaNome(value);
        if (name === 'categoriaDescricao') setCategoriaDescricao(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(usuarios);

        setCanCreate(true);
    };

    // carrega chamados criados
    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) router.push('/');
        (async () => {
            try {
                const response = await fetch(API.TICKET, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error('Erro ao buscar tickets:', response.status);
                    return;
                }
                const data = await response.json();
                setChamados(data);
            } catch (err) {
                console.error('Erro na requisição:', err);
                alert('Erro na requisição, por favor, tente novamente.');
            }
        })();
    }, [reload]);

    const handleChamadoClick = (chamado) => {
        setChamadoSelecionado(chamado);
    };

    const handleFecharDetalhes = () => {
        setChamadoSelecionado(null);
    };

    const handleAtualizarStatus = (novoStatus) => {
        // Atualiza o status do chamado selecionado
        setChamados((prev) => prev.map((c) => (c.id === chamadoSelecionado.id ? { ...c, status: novoStatus } : c)));
        setChamadoSelecionado({ ...chamadoSelecionado, status: novoStatus });
    };

    // Estados para edição de usuário
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [editUserData, setEditUserData] = useState({
        id: '',
        nome: '',
        email: '',
        senha: '',
        funcao: '',
        categoria: '',
    });

    function handleEditUser(usuario) {
        setEditUserData({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            senha: '',
            funcao: usuario.funcao,
            categoria: usuario.categoria || '',
        });
        setShowEditUserModal(true);
    }

    function handleEditInputChange(e) {
        const { name, value } = e.target;
        setEditUserData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleEditUserSubmit(e) {
        e.preventDefault();
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];
        if (!token) {
            alert('Token não encontrado. Faça login novamente.');
            return;
        }
        try {
            const body = {
                nome: editUserData.nome,
                email: editUserData.email,
                funcao: editUserData.funcao,
            };
            if (editUserData.senha) body.senha = editUserData.senha;
            if (editUserData.funcao === 'admin' && editUserData.categoria) body.categoria = editUserData.categoria;
            const response = await fetch(`${API.USERS}/${editUserData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                alert('Erro ao atualizar usuário.');
                return;
            }
            setShowEditUserModal(false);
            setReload((r) => !r);
        } catch (err) {
            alert('Erro na requisição.');
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormChamadoData((prev) => ({ ...prev, [name]: value }));
    };

    // formulario de chamado admin
    const handleSubmitAdmin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];
        if (!token) {
            setError('Admin não autenticado.');
            setLoading(false);
            return;
        }
        try {
            console.log(formChamadoData);

            const response = await fetch(API.TICKET, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    titulo: formChamadoData.equipamentoId,
                    descricao: formChamadoData.descricao,
                    tipo_id: formChamadoData.categoria,
                }),
            });
            console.log('Enviando Dados', formChamadoData);

            if (!response.ok) {
                setError('Erro ao criar chamado.');
                setLoading(false);
                return;
            }
            setReload(!reload);
            setSuccess(true);
            setFormData({ equipamentoId: '', categoria: '', descricao: '' });
        } catch (err) {
            setError('Erro na requisição.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Cabeçalho da página */}
            <header className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 shadow-md">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold">Painel Administrativo</h1>
                    <p className="text-red-100">Gerencie usuários, departamentos e visualize estatísticas</p>
                </div>
            </header>

            <div className="container mx-auto p-6 flex-1">
                {/* Menu de navegação principal */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                    <nav className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'dashboard' ? 'bg-red-100 text-red-700 font-medium' : 'hover:bg-gray-100'
                                }`}
                        >
                            <BarChart2 className="h-5 w-5" />
                            <span>Dashboard</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('usuarios')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'usuarios'
                                ? 'bg-yellow-100 text-yellow-700 font-medium'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <Users className="h-5 w-5" />
                            <span>Usuários</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('relatorios')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'relatorios'
                                ? 'bg-green-100 text-green-700 font-medium'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <PieChart className="h-5 w-5" />
                            <span>Relatórios</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('chamados')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'chamados' ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
                                }`}
                        >
                            <PieChart className="h-5 w-5" />
                            <span>Chamados</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('categorias')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'categorias'
                                ? 'bg-pink-100 text-pink-700 font-medium'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <PieChart className="h-5 w-5" />
                            <span>Categorias</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('pool')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'pool' ? 'bg-red-100 text-red-700 font-medium' : 'hover:bg-gray-100'
                                }`}
                        >
                            <Layers className="h-5 w-5" />
                            <span>Pool de Chamados</span>
                        </button>
                    </nav>
                </div>

                {/* Conteúdo das abas */}
                {activeTab === 'dashboard' && (
                    <div>
                        {/* Cards de estatísticas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Usuários</h3>
                                    <div className="rounded-full bg-blue-100 p-3">
                                        <Users className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Usuários comuns</p>
                                        <p className="text-2xl font-bold text-gray-800">{estatisticas.totalUsuarios}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Técnicos</p>
                                        <p className="text-2xl font-bold text-gray-800">{estatisticas.totaladmins}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Admins</p>
                                        <p className="text-2xl font-bold text-gray-800">{estatisticas.totalAdmins}</p>
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
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Abertos</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {estatisticas.chamadosAbertos}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Em Progresso</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {estatisticas.chamadosEmProgresso}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Fechados</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {estatisticas.chamadosFechados}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gráficos */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm w-full">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Chamados por Categoria</h3>
                            <GraficoDeChamados data={chamadosPorCategoria} />
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
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                            <div className="w-auto flex space-x-3">
                                <button
                                    onClick={() => setShowUserModal(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>Novo Usuário</span>
                                </button>
                            </div>
                        </div>

                        {/* Filtros de Tipo */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option>Todos</option>
                                <option value={'usuario'}>Usuário</option>
                                <option value={'tecnico'}>Técnico</option>
                                <option value={'admin'}>Administrador</option>
                            </select>
                        </div>

                        {/* Lista de usuários */}
                        {loadingUsers ? (
                            <div className="flex justify-center items-center h-48">
                                <p className="text-gray-500 text-lg">Carregando usuários...</p>
                            </div>
                        ) : filteredUsers.length > 0 ? (
                            <div className="space-y-4">
                                {filteredUsers.map((usuario) => (
                                    <div
                                        key={usuario.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-800">{usuario.nome}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{usuario.email}</p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${usuario.status === 'ativo'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {usuario.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${usuario.funcao === 'admin'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}
                                            >
                                                {usuario.funcao}
                                            </span>
                                            <div className="flex space-x-3">
                                                <button
                                                    className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center"
                                                    onClick={() => handleEditUser(usuario)}
                                                >
                                                    <Settings className="h-3 w-3 mr-1" />
                                                    Editar
                                                </button>

                                                {/* Modal de edição de usuário */}
                                                {showEditUserModal && (
                                                    <div className="fixed inset-0 backdrop-blur-xs bg-black/20 flex items-center justify-center z-50 p-4">
                                                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200">
                                                            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
                                                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                                                    <Settings className="h-5 w-5 mr-2 text-blue-600" />
                                                                    Editar Usuário
                                                                </h2>
                                                                <button
                                                                    onClick={() => setShowEditUserModal(false)}
                                                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-white hover:bg-opacity-50 rounded-full"
                                                                >
                                                                    <span className="text-2xl">&times;</span>
                                                                </button>
                                                            </div>
                                                            <form
                                                                onSubmit={handleEditUserSubmit}
                                                                className="p-6 space-y-4"
                                                            >
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        Nome Completo *
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="nome"
                                                                        value={editUserData.nome}
                                                                        onChange={handleEditInputChange}
                                                                        required
                                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
                                                                        placeholder="Digite o nome completo"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        Email *
                                                                    </label>
                                                                    <input
                                                                        type="email"
                                                                        name="email"
                                                                        value={editUserData.email}
                                                                        onChange={handleEditInputChange}
                                                                        required
                                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
                                                                        placeholder="usuario@email.com"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        Senha (deixe em branco para não alterar)
                                                                    </label>
                                                                    <input
                                                                        type="password"
                                                                        name="senha"
                                                                        value={editUserData.senha}
                                                                        onChange={handleEditInputChange}
                                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
                                                                        placeholder="Digite a nova senha"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        Tipo de Usuário *
                                                                    </label>
                                                                    <select
                                                                        name="funcao"
                                                                        value={editUserData.funcao}
                                                                        onChange={handleEditInputChange}
                                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-500"
                                                                        required
                                                                    >
                                                                        <option value="usuario">Usuário</option>
                                                                        <option value="tecnico">Técnico</option>
                                                                        <option value="admin">Admin</option>
                                                                    </select>
                                                                </div>
                                                                {editUserData.funcao === 'admin' && (
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Categoria
                                                                        </label>
                                                                        <select
                                                                            name="categoria"
                                                                            value={editUserData.categoria}
                                                                            onChange={handleEditInputChange}
                                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-500"
                                                                        >
                                                                            <option value="">
                                                                                Selecione uma categoria
                                                                            </option>
                                                                            {categorias.map((cat) => (
                                                                                <option key={cat.id} value={cat.id}>
                                                                                    {cat.titulo}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowEditUserModal(false)}
                                                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                                                    >
                                                                        Cancelar
                                                                    </button>
                                                                    <button
                                                                        type="submit"
                                                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
                                                                    >
                                                                        Salvar Alterações
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                )}
                                                {usuario.status === 'ativo' && (
                                                    <button
                                                        className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center"
                                                        onClick={() => updataStatus(usuario.id, 'inativo')}
                                                    >
                                                        <User className="h-3 w-3 mr-1" />
                                                        Desativar
                                                    </button>
                                                )}
                                                {usuario.status === 'inativo' && (
                                                    <button
                                                        className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center"
                                                        onClick={() => updataStatus(usuario.id, 'ativo')}
                                                    >
                                                        <User className="h-3 w-3 mr-1" />
                                                        Ativar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">Nenhum usuário encontrado.</div>
                        )}
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
                                <p className="text-sm text-gray-600 text-center mb-4">
                                    Visualize a distribuição de chamados por status atual.
                                </p>
                                <button className="w-full py-2 px-4 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors">
                                    Gerar Relatório
                                </button>
                            </div>

                            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4 mx-auto">
                                    <Clock className="h-8 w-8 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-medium text-center mb-2">Tempo Médio de Resolução</h3>
                                <p className="text-sm text-gray-600 text-center mb-4">
                                    Analise o tempo médio de resolução por categoria e técnico.
                                </p>
                                <button className="w-full py-2 px-4 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors">
                                    Gerar Relatório
                                </button>
                            </div>

                            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4 mx-auto">
                                    <Users className="h-8 w-8 text-yellow-500" />
                                </div>
                                <h3 className="text-lg font-medium text-center mb-2">Chamados por Técnico</h3>
                                <p className="text-sm text-gray-600 text-center mb-4">
                                    Compare o desempenho e volume de chamados por técnico.
                                </p>
                                <button className="w-full py-2 px-4 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors">
                                    Gerar Relatório
                                </button>
                            </div>

                            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 mx-auto">
                                    <PieChart className="h-8 w-8 text-green-500" />
                                </div>
                                <h3 className="text-lg font-medium text-center mb-2">Chamados por Categoria</h3>
                                <p className="text-sm text-gray-600 text-center mb-4">
                                    Analise a distribuição de chamados por categoria e tipo.
                                </p>
                                <button className="w-full py-2 px-4 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors">
                                    Gerar Relatório
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'chamados' && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                            <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                            Chamados
                        </h2>
                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <PlusCircle className="h-5 w-5 mr-2 text-red-600" />
                                Criar Novo Chamado
                            </h2>

                            {/* Filtros e busca */}
                            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex-1 min-w-[200px]">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Preencha os dados abaixo para criar um novo chamado
                                    </p>
                                </div>
                            </div>

                            <form className='space-y-6' onSubmit={handleSubmitAdmin}>
                                {/* Linha 1 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Id do equipamento
                                        </label>
                                        <input
                                            type="text"
                                            name="equipamentoId"
                                            value={formChamadoData.equipamentoId}
                                            onChange={handleChange}
                                            placeholder="Digite o Id do equipamento"
                                            className="input-field text-gray-700"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Categoria
                                        </label>
                                        <select
                                            name='categoria'
                                            value={formChamadoData.categoria}
                                            onChange={handleChange}
                                            className='input-field text-gray-700'
                                        >
                                            <option value="">Selecione uma categoria</option>
                                            {categorias.map((categoria) => (
                                                <option key={categoria.id} value={categoria.id}>
                                                    {categoria.titulo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        name='descrição'
                                        value={formChamadoData.descricao}
                                        onChange={handleChange}
                                        placeholder="Descreva detalhadamente o problema ou solicitação"
                                        rows={4}
                                        className="input-field text-gray-700"
                                    ></textarea>
                                </div>

                                {/* Botões */}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        <span>{loading ? 'Criando...' : 'Criar Chamado'}</span>
                                    </button>
                                    {success && (
                                        <div className='text-green-600 font-medium self-center'>Chamado criado com sucesso!</div>
                                    )}
                                    {error && <div className='text-red-600 font-medium self-center'>{error}</div>}
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'categorias' && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                            <PieChart className="h-5 w-5 mr-2 text-pink-600" />
                            Gerenciamento de Categorias
                        </h2>

                        {/* Formulário de criação de categoria */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                criarCategoria();
                            }}
                            className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <h3 className="text-lg text-black font-semibold mb-4">Criar Nova Categoria</h3>
                            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="categoriaNome" className="block text-sm font-medium text-gray-700">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        id="categoriaNome"
                                        name="categoriaNome"
                                        value={categoriaNome}
                                        onChange={handleInputChangeCategoria}
                                        className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Ex: Hardware"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor="categoriaDescricao"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Descrição
                                    </label>
                                    <input
                                        type="text"
                                        id="categoriaDescricao"
                                        name="categoriaDescricao"
                                        value={categoriaDescricao}
                                        onChange={handleInputChangeCategoria}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Ex: Problemas com computadores e periféricos"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Criar Categoria</span>
                                </button>
                            </div>
                        </form>

                        {/* Lista de categorias */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Categorias Existentes</h3>
                        {categorias.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                {categorias.map((categoria) => (
                                    <div
                                        key={categoria.id}
                                        className="bg-gray-100 p-4 rounded-lg border border-gray-200"
                                    >
                                        <h4 className="font-medium text-gray-800">{categoria.titulo}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{categoria.descricao}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Nenhuma categoria encontrada.</p>
                        )}
                    </div>
                )}

                {/* Área de Pool de Chamados */}
                {(activeTab === 'pool') && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                            {activeTab === 'pool' && <Layers className="h-5 w-5 mr-2 text-red-600" />}
                            {activeTab === 'pool' && 'Pool de Chamados'}
                        </h2>

                        {/* Filtros e busca */}
                        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="relative max-w-xs">
                                <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 max-w-xs text-gray-700"
                                    value={statusFiltro}
                                    onChange={(e) => setStatusFiltro(e.target.value)}
                                >
                                    <option value="">Todos os status</option>
                                    <option value="pendente">Pendente</option>
                                    <option value="em progresso">Em Progresso</option>
                                    <option value="concluído">Concluído</option>
                                </select>
                            </div>

                            <div className="relative max-w-xs ml-10">
                                <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 max-w-xs text-gray-700"
                                    value={categoriaFiltro}
                                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                                >
                                    <option value="">Todas as categorias</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.titulo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Conteúdo principal */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Lista de chamados */}
                            <div
                                className={`${chamadoSelecionado ? 'lg:w-1/2' : 'w-full'
                                    } bg-white rounded-lg border border-gray-200`}
                            >
                                {/* Lista de chamados */}
                                <div className="space-y-4 p-4">
                                    {chamados.map((chamado) => (
                                        <div
                                            key={chamado.id}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${chamadoSelecionado?.id === chamado.id
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                                                }`}
                                            onClick={() => handleChamadoClick(chamado)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium text-gray-800">{chamado.titulo}</h3>
                                                <div
                                                    className={`px-2 py-1 text-xs rounded-full ${chamado.status === 'Pendente'
                                                        ? 'bg-red-100 text-red-800'
                                                        : chamado.status === 'Em Progresso'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}
                                                >
                                                    {chamado.status}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                {chamado.descricao}
                                            </p>
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
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Cabeçalho do chamado */}
                                        <div>
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-medium text-gray-800">
                                                    {chamadoSelecionado.titulo}
                                                </h3>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${chamadoSelecionado.status === 'Pendente'
                                                        ? 'bg-red-100 text-red-800'
                                                        : chamadoSelecionado.status === 'Em Progresso'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}
                                                >
                                                    {chamadoSelecionado.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <FileText className="h-4 w-4 mr-1" />#{chamadoSelecionado.id}
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
                                                <p className="font-medium text-gray-700">
                                                    {chamadoSelecionado.usuario}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Categoria</p>
                                                <p className="font-medium text-gray-700">
                                                    {chamadoSelecionado.categoria}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500"></p>
                                            </div>
                                        </div>

                                        {/* Descrição */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Descrição</h4>
                                            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                                                {chamadoSelecionado.descricao}
                                            </p>
                                        </div>

                                        <div>
                                            <label htmlFor="atribuir" className="block text-sm font-medium text-gray-700">
                                                Atribuir a um técnico
                                            </label>
                                            <select
                                                id="atribuir"
                                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition outline-none bg-gray-50 shadow-sm text-black"
                                            >
                                                <option value="">Selecione um técnico</option>
                                                {usuarios
                                                    .filter((user) => user.funcao === 'tecnico' && user.status === 'ativo')
                                                    .map((tecnico) => (
                                                        <option key={tecnico.id} value={tecnico.id}>
                                                            {tecnico.nome} ({tecnico.email})
                                                        </option>
                                                    ))}


                                            </select>
                                        </div>

                                        <div className="flex justify-end mt-2">
                                            <button
                                                type="button"
                                                disabled={loading}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition cursor-pointer

                                                    ${loading
                                                        ? "bg-gray-300 cursor-not-allowed text-gray-600"
                                                        : "bg-red-600 hover:bg-red-500 text-white"
                                                    }`}
                                            >
                                                {loading ? (
                                                    <span className="animate-pulse">Enviando...</span>
                                                ) : (
                                                    <>
                                                        <Send size={14} />
                                                        Enviar
                                                    </>
                                                )}
                                            </button>
                                        </div>


                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal para Novo Usuário */}
            {showUserModal && (
                <div className="fixed inset-0 backdrop-blur-xs bg-black/20 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100 rounded-t-xl">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <UserPlus className="h-5 w-5 mr-2 text-red-600" />
                                Novo Usuário
                            </h2>
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-white hover:bg-opacity-50 rounded-full"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-700"
                                    placeholder="Digite o nome completo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-700"
                                    placeholder="usuario@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Senha *</label>
                                <input
                                    type="password"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-700"
                                    placeholder="Digite a senha"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Usuário *
                                </label>
                                <select
                                    name="funcao"
                                    value={formData.funcao}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-500"
                                >
                                    <option value="">Selecione</option>
                                    <option value="usuario">Usuário</option>
                                    <option value="tecnico">Técnico</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Mostrar categorias se for técnico */}
                            {formData.funcao === 'tecnico' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                                    <select
                                        name="categoria"
                                        value={formData.categoria}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-500"
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        {categorias.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.titulo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowUserModal(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium shadow-md hover:shadow-lg"
                                >
                                    Criar Usuário
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}
