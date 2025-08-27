'use client';

import { useState, useEffect } from 'react';

import {
    PlusCircle,
    FileText,
    Paperclip,
    Search,
    Filter,
    Calendar,
    Layers,
    MessageSquare,
    Settings,
    User,
    CheckCircle,
    Clock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API } from '../../../config/routes';

export default function Usuario() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('criarChamado');
    const [chamados, setChamados] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [reload, setReload] = useState(false);
    const [formData, setFormData] = useState({
        equipamentoId: '',
        categoria: '',
        descricao: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    // Filtros
    const [statusFiltro, setStatusFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];
        if (!token) {
            setError('Usuário não autenticado.');
            setLoading(false);
            return;
        }
        try {
            console.log(formData);

            const response = await fetch(API.TICKET, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    titulo: formData.equipamentoId,
                    descricao: formData.descricao,
                    tipo_id: formData.categoria,
                }),
            });
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

    // busca chamados do usuario
    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) router.push('/');
        (async () => {
            try {
                const response = await fetch(API.GET_USER_TICKETS, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    console.error('Erro ao buscar chamados:', response.status);
                    return;
                }
                const chamados = await response.json();
                setChamados(chamados);
            } catch (err) {
                console.error('Erro na requisição:', err);
            }
        })();
    }, [reload]);

    // Filtragem dos chamados
    const chamadosFiltrados = chamados.filter((chamado) => {
        let statusOk = true;
        let categoriaOk = true;
        if (statusFiltro && statusFiltro !== 'Todos') {
            statusOk = chamado.status === statusFiltro;
        }
        if (categoriaFiltro && categoriaFiltro !== 'Todas') {
            // categoriaFiltro é o id da categoria
            categoriaOk = String(chamado.tipo_id) === String(categoriaFiltro);
        }
        return statusOk && categoriaOk;
    });

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Cabeçalho da página */}
            <header className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 shadow-md">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold">Área do Usuário</h1>
                    <p className="text-red-100">Gerencie seus chamados de suporte técnico</p>
                </div>
            </header>

            <div className="container mx-auto p-6 flex-1 overflow-auto">
                {/* Menu de navegação principal */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                    <nav className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setActiveTab('criarChamado')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${
                                activeTab === 'criarChamado'
                                    ? 'bg-red-100 text-red-700 font-medium'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <PlusCircle className="h-5 w-5" />
                            <span>Criar Chamado</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('meusChamados')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${
                                activeTab === 'meusChamados'
                                    ? 'bg-yellow-100 text-yellow-700 font-medium'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <FileText className="h-5 w-5" />
                            <span>Meus Chamados</span>
                        </button>
                    </nav>
                </div>

                {/* Conteúdo das abas */}
                {activeTab === 'criarChamado' && (
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

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Linha 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Id do equipamento
                                    </label>
                                    <input
                                        type="text"
                                        name="equipamentoId"
                                        value={formData.equipamentoId}
                                        onChange={handleChange}
                                        placeholder="Digite o Id do equipamento"
                                        className="input-field text-gray-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                    <select
                                        name="categoria"
                                        value={formData.categoria}
                                        onChange={handleChange}
                                        className="input-field text-gray-700"
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
                                    name="descricao"
                                    value={formData.descricao}
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
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-60"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span>{loading ? 'Criando...' : 'Criar Chamado'}</span>
                                </button>
                                {success && (
                                    <div className="text-green-600 font-medium mt-4">Chamado criado com sucesso!</div>
                                )}
                                {error && <div className="text-red-600 font-medium mt-4">{error}</div>}
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'meusChamados' && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-yellow-600" />
                            Meus Chamados
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

                        {/* Lista de chamados */}
                        <div className="space-y-4">
                            {chamadosFiltrados.length > 0 ? (
                                chamadosFiltrados.map((chamado) => (
                                    <div key={chamado.id} className="border border-gray-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-800">
                                            ID de patrimônio: {chamado.titulo}
                                        </h3>
                                        <p className="text-gray-600">Descrição: {chamado.descricao}</p>
                                        <p className="text-gray-600">Técnico Responsável: {chamado.tecnico_id}</p>
                                        <span className="text-gray-600">Status: {chamado.status}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-600">Nenhum chamado encontrado</div>
                            )}
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
