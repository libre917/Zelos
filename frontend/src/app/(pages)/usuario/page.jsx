'use client';

import { useState, useEffect } from 'react';

import {
    PlusCircle,
    FileText,
    Filter,
    Calendar,
    CheckCircle,
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
    const [apontamento, setApontamento] = useState([]);
    // Filtros
    const [statusFiltro, setStatusFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    // Chamado selecionado para visualização de detalhes
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
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
                const chamado = await response.json();
                setChamados(chamado);

                // Buscar apontamentos para todos os chamados (não só concluídos)
                const chamadosComApontamentos = await Promise.all(
                    chamado.map(async (ticket) => {
                        try {
                            const apontamentosResponse = await fetch(API.GET_TICKET_NOTES(ticket.id), {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            let apontamentos = [];
                            if (apontamentosResponse.ok) {
                                apontamentos = await apontamentosResponse.json();
                            }
                            // Pega o último apontamento (mais recente)
                            const ultimoApontamento =
                                apontamentos.length > 0 ? apontamentos[apontamentos.length - 1] : null;
                            return {
                                ...ticket,
                                apontamentos: apontamentos,
                                apontamento: ultimoApontamento?.descricao || null,
                            };
                        } catch (err) {
                            // Se der erro, retorna o chamado sem apontamentos
                            console.error('Erro ao buscar apontamentos:', err);
                            return { ...ticket, apontamentos: [], apontamento: null };
                        }
                    })
                );

                setChamados(chamadosComApontamentos);
            } catch (err) {
                console.error('Erro na requisição:', err);
            }
        })();
    }, [reload]);


    // Filtragem dos chamados
    const chamadosFiltrados = chamados.filter((chamado) => {
        let statusOk = true;
        let categoriaOk = true;
        if (statusFiltro && statusFiltro !== '') {
            statusOk = chamado.status === statusFiltro;
        }
        if (categoriaFiltro && categoriaFiltro !== '') {
            // categoriaFiltro é o id da categoria
            categoriaOk = String(chamado.tipo_id) === String(categoriaFiltro);
        }
        return statusOk && categoriaOk;
    });

    // Função para selecionar um chamado para visualização detalhada
    const handleSelecionarChamado = (chamado) => {
        setChamadoSelecionado(chamado);
    };

    // Função para fechar os detalhes do chamado
    const handleFecharDetalhes = () => {
        setChamadoSelecionado(null);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Cabeçalho da página */}
            <header className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 shadow-md">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold">Área do Usuário</h1>
                    <p className="text-red-100">Gerencie seus chamados de suporte técnico</p>
                </div>
            </header>

            <div className="container mx-auto p-6 flex-1">
                {/* Menu de navegação principal */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                    <nav className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setActiveTab('criarChamado')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'criarChamado'
                                ? 'bg-red-100 text-red-700 font-medium'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <PlusCircle className="h-5 w-5" />
                            <span>Criar Chamado</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('meusChamados')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${activeTab === 'meusChamados'
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
                                        maxLength={10}
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
                                    <option value="em andamento">Em Andamento</option>
                                    <option value="concluido">Concluído</option>
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

                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Lista de chamados */}
                            <div className={`${chamadoSelecionado ? 'lg:w-1/2' : 'w-full'} space-y-4`}>
                                {chamadosFiltrados.length > 0 ? (
                                    chamadosFiltrados.map((chamado) => (
                                        <div
                                            key={chamado.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => handleSelecionarChamado(chamado)}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-semibold text-gray-800">
                                                    ID de patrimônio: {chamado.titulo}
                                                </h3>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${chamado.status === 'pendente'
                                                        ? 'bg-red-100 text-red-800'
                                                        : chamado.status === 'em andamento'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}
                                                >
                                                    {chamado.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 line-clamp-2">{chamado.descricao}</p>
                                            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                                <span>Técnico: {chamado.tecnico || 'Não atribuído'}</span>
                                                <span className="flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {new Date(chamado.criado_em).toLocaleString('pt-BR')}
                                                </span>
                                            </div>

                                            {/* Prévia do apontamento para chamados concluídos */}
                                            {chamado.status === 'concluído' && chamado.apontamento && (
                                                <div className="mt-2 pt-2 border-t border-gray-100">
                                                    <p className="text-xs text-gray-500 flex items-center">
                                                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                                        Resolução: {chamado.apontamento.descricao.substring(0, 50)}...
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-600 p-4 bg-gray-50 rounded-lg text-center">
                                        Nenhum chamado encontrado
                                    </div>
                                )}
                            </div>

                            {/* Detalhes do chamado selecionado */}
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
                                        <div>
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-medium text-gray-800">
                                                    {chamadoSelecionado.titulo}
                                                </h3>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${chamadoSelecionado.status === 'pendente'
                                                        ? 'bg-red-100 text-red-800'
                                                        : chamadoSelecionado.status === 'em andamento'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}
                                                >
                                                    {chamadoSelecionado.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {new Date(chamadoSelecionado.criado_em).toLocaleString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-500">Solicitante</p>
                                                <p className="font-medium text-gray-700">
                                                    {chamadoSelecionado.usuario || 'Não informado'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Categoria</p>
                                                <p className="font-medium text-gray-700">
                                                    {chamadoSelecionado.tipo || 'Não informado'}
                                                </p>
                                            </div>
                                            {chamadoSelecionado.tecnico && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Técnico Responsável</p>
                                                    <p className="font-medium text-gray-700">
                                                        {chamadoSelecionado.tecnico}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Descrição</h4>
                                            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg break-words">
                                                {chamadoSelecionado.descricao}
                                            </p>
                                        </div>

                                        {/* Mostra o apontamento completo se o chamado estiver resolvido */}
                                        {chamadoSelecionado.status === 'concluido' && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    Apontamentos da Resolução
                                                </h4>
                                                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                                                    {chamadoSelecionado.apontamento &&
                                                        chamadoSelecionado.apontamento.length > 0 ? (
                                                        <div className="space-y-3">

                                                            <div
                                                                key={chamadoSelecionado.id}
                                                                className="border-b border-green-200 last:border-b-0 pb-2 last:pb-0"
                                                            >
                                                                <p className="text-green-700 whitespace-pre-wrap break-words">
                                                                    {chamadoSelecionado.apontamento}
                                                                </p>
                                                                <p className="text-xs text-green-600 mt-1">
                                                                    {new Date(chamadoSelecionado.criado_em).toLocaleString(
                                                                        'pt-BR'
                                                                    )}
                                                                    {chamadoSelecionado.duracao &&
                                                                        ` • Duração: ${Math.round(
                                                                            chamadoSelecionado.duracao / 60
                                                                        )} min`}
                                                                </p>
                                                            </div>

                                                        </div>
                                                    ) : (
                                                        <p className="text-green-700">Nenhum apontamento encontrado.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Paginação */}
                        {!chamadoSelecionado && chamadosFiltrados.length > 0 && (
                            <div className="flex items-center justify-between mt-6 bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-700 flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-red-500" />
                                    {chamadosFiltrados.length} chamados encontrados
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
