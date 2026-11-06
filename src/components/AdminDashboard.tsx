import React, { useState, useEffect } from 'react';
import { Estudante, StatusEstudante } from '../types/supabase';
import { toggleStudentQuotaPayment, fetchAdminEstudantesList, deleteStudentProfile, signUpStudent, toggleAdminRole } from '../lib/studentService';
import { ShieldCheck, Search, Filter, Download, ChevronLeft, ChevronRight, Users, UserCheck, Star, RefreshCw, Phone, Mail, Award, CheckCircle2, AlertTriangle, CreditCard, Trash2, UserPlus, X, Lock, User, Shield } from 'lucide-react';

interface AdminDashboardProps {
  currentAdmin: Estudante;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  onRequestConfirm: (title: string, message: string, onConfirm: () => void, isDanger?: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdmin,
  onShowToast,
  onRequestConfirm,
}) => {
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [anoFilter, setAnoFilter] = useState<string>('Todos');
  const [quotaFilter, setQuotaFilter] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Modal for admin creating a member/admin
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newTelefone, setNewTelefone] = useState('');
  const [newStatus, setNewStatus] = useState<StatusEstudante>('Novo / Caloiro');
  const [newAno, setNewAno] = useState('1º Ano');
  const [newCurso, setNewCurso] = useState('Engenharia Informática');
  const [newQuotaVal, setNewQuotaVal] = useState<number>(10000);
  const [newIsAdmin, setNewIsAdmin] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchAdminEstudantesList();
    setLoading(false);

    if (res.error) {
      onShowToast('Erro ao carregar dados do Supabase', res.error, 'error');
    } else {
      setEstudantes(res.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Admin creating a new student or admin
  const handleAdminCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome.trim() || !newEmail.trim() || !newPassword) {
      onShowToast('Campos Obrigatórios', 'Preencha o Nome, Email e Palavra-passe.', 'error');
      return;
    }

    setCreateLoading(true);
    const matriculaGen = `2026${Math.floor(1000 + Math.random() * 9000)}`;
    const res = await signUpStudent({
      nome_completo: newNome.trim(),
      email: newEmail.trim(),
      password: newPassword,
      telefone: newTelefone.trim(),
      status_estudante: newStatus,
      ano_estudo: newAno,
      curso: newCurso.trim(),
      matricula: matriculaGen,
      valor_quota: Number(newQuotaVal) || 10000,
      is_admin: newIsAdmin,
    });
    setCreateLoading(false);

    if (res.error) {
      onShowToast('Erro ao criar conta', res.error, 'error');
    } else {
      setEstudantes(prev => [res.profile, ...prev]);
      onShowToast(
        'Conta Criada com Sucesso!',
        `${newNome} foi registado como ${newIsAdmin ? 'Administrador 👑' : 'Estudante 🎓'}.`,
        'success'
      );
      setIsCreateModalOpen(false);
      setNewNome('');
      setNewEmail('');
      setNewPassword('');
      setNewTelefone('');
      setNewIsAdmin(false);
    }
  };

  // Admin toggling another member's admin role
  const handleToggleAdminRole = (studentId: string, currentAdminStatus: boolean, studentName: string) => {
    if (studentId === currentAdmin.id) {
      onShowToast('Ação Não Permitida', 'Não pode revogar a sua própria função de Administrador.', 'error');
      return;
    }

    const actionText = currentAdminStatus ? 'revogar os privilégios de Administrador de' : 'promover a Administrador';
    onRequestConfirm(
      currentAdminStatus ? 'Revogar Administrador' : 'Promover a Administrador',
      `Deseja ${actionText} ${studentName}?`,
      async () => {
        const res = await toggleAdminRole(studentId, !currentAdminStatus);
        if (res.error) {
          onShowToast('Erro ao alterar privilégios', res.error, 'error');
        } else {
          setEstudantes(prev => prev.map(s => s.id === studentId ? { ...s, is_admin: !currentAdminStatus } : s));
          onShowToast(
            'Função Atualizada',
            `${studentName} é agora ${!currentAdminStatus ? 'Administrador 👑' : 'Estudante normal 🎓'}.`,
            'success'
          );
        }
      }
    );
  };

  // Admin exclusive action: Delete Member
  const handleDeleteMember = (studentId: string, studentName: string) => {
    onRequestConfirm(
      'Eliminar Membro',
      `Tem a certeza de que pretende eliminar permanentemente o estudante ${studentName}? Esta ação não pode ser desfeita.`,
      async () => {
        const res = await deleteStudentProfile(studentId);
        if (res.error) {
          onShowToast('Erro ao eliminar membro', res.error, 'error');
        } else {
          setEstudantes(prev => prev.filter(s => s.id !== studentId));
          onShowToast('Membro Eliminado com Sucesso', `${studentName} foi removido do sistema.`, 'success');
        }
      },
      true
    );
  };

  // Admin exclusive action: Toggle student payment
  const handleToggleQuota = async (studentId: string, currentPaid: boolean | undefined, studentName: string) => {
    const newPaidStatus = !currentPaid;
    const res = await toggleStudentQuotaPayment(studentId, newPaidStatus, currentAdmin.nome_completo);
    
    if (res.error) {
      onShowToast('Erro ao atualizar quota', res.error, 'error');
    } else {
      setEstudantes(prev => prev.map(s => s.id === studentId ? res.profile : s));
      onShowToast(
        newPaidStatus ? 'Pagamento de Quota Validado!' : 'Quota alterada para Pendente',
        `A quota de ${studentName} foi ${newPaidStatus ? 'confirmada' : 'marcada como pendente'}.`,
        newPaidStatus ? 'success' : 'info'
      );
    }
  };

  // Filter 1: Status Filter
  // Filter 2: Ano de Estudo Filter
  // Filter 3: Quota Payment Filter
  // Search: Real-time search by nome_completo, email or matricula
  const filteredList = estudantes.filter(item => {
    if (statusFilter !== 'Todos' && item.status_estudante !== statusFilter) {
      return false;
    }
    if (anoFilter !== 'Todos' && item.ano_estudo !== anoFilter) {
      return false;
    }
    if (quotaFilter === 'Pagas' && !item.quota_paga) {
      return false;
    }
    if (quotaFilter === 'Pendentes' && item.quota_paga) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNome = item.nome_completo.toLowerCase().includes(q);
      const matchEmail = item.email.toLowerCase().includes(q);
      const matchMatricula = (item.matricula || '').toLowerCase().includes(q);
      const matchCurso = item.curso.toLowerCase().includes(q);
      return matchNome || matchEmail || matchMatricula || matchCurso;
    }
    return true;
  });

  // Reset to Page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, anoFilter, quotaFilter, searchQuery]);

  // Pagination calculations
  const totalRecords = filteredList.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedList = filteredList.slice(startIndex, startIndex + pageSize);

  // CSV Export Functionality
  const handleExportCSV = () => {
    if (filteredList.length === 0) {
      onShowToast('Sem dados para exportar', 'Nenhum estudante corresponde aos filtros.', 'error');
      return;
    }

    const headers = ['ID', 'Nome Completo', 'Email', 'Telefone', 'Status Estudante', 'Ano Estudo', 'Curso', 'Matrícula', 'Admin', 'Data Criacao'];
    const rows = filteredList.map(s => [
      s.id,
      `"${s.nome_completo}"`,
      s.email,
      s.telefone || '',
      `"${s.status_estudante}"`,
      `"${s.ano_estudo}"`,
      `"${s.curso}"`,
      s.matricula || '',
      s.is_admin ? 'Sim' : 'Nao',
      s.created_at || ''
    ]);

    const csvString = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `estudantes_relatorio_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    onShowToast('Relatório CSV descarregado!', `${filteredList.length} registros exportados.`, 'success');
  };

  const novatosTotal = estudantes.filter(s => s.status_estudante === 'Novo / Caloiro').length;
  const veteranosTotal = estudantes.filter(s => s.status_estudante === 'Antigo / Veterano').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Stats Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Painel de Administração
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Gestão Global de Estudantes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Consulta, filtragem avançada e exportação do registo académico do Supabase.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-2">
            <Star className="w-4 h-4 text-indigo-500" />
            Novatos: <span className="text-sm tabular-nums">{novatosTotal}</span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            Veteranos: <span className="text-sm tabular-nums">{veteranosTotal}</span>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            + Registar Membro / Admin
          </button>

          <button
            onClick={loadData}
            title="Recarregar dados"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Real-time Search Box */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por nome, e-mail, matrícula ou curso..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Filter 1: Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Todos">Status: Todos</option>
              <option value="Novo / Caloiro">Apenas Novo / Caloiro</option>
              <option value="Antigo / Veterano">Apenas Antigo / Veterano</option>
            </select>
          </div>

          {/* Filter 2: Ano de Estudo Filter */}
          <div className="md:col-span-2">
            <select
              value={anoFilter}
              onChange={(e) => setAnoFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Todos">Ano: Todos</option>
              <option value="1º Ano">1º Ano</option>
              <option value="2º Ano">2º Ano</option>
              <option value="3º Ano / LST">3º Ano / LST</option>
              <option value="Master 1">Master 1</option>
              <option value="Master 2">Master 2</option>
            </select>
          </div>

          {/* Filter 3: Quota Payment Filter */}
          <div className="md:col-span-2">
            <select
              value={quotaFilter}
              onChange={(e) => setQuotaFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Todas">Quota: Todas</option>
              <option value="Pagas">✅ Apenas Quotas Pagas</option>
              <option value="Pendentes">⚠️ Apenas Pendentes</option>
            </select>
          </div>

          {/* CSV Export Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleExportCSV}
              className="w-full py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </button>
          </div>

        </div>
      </div>

      {/* Main Admin Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
            <span>A carregar registos do banco de dados...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            Nenhum estudante encontrado com os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Estudante</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Quota / Pagamento</th>
                  <th className="p-4">Ano / Curso</th>
                  <th className="p-4">Matrícula</th>
                  <th className="p-4 text-center">Ação Admin (Confirmar Quota)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedList.map((st) => {
                  const isNovato = st.status_estudante === 'Novo / Caloiro';
                  const isQuotaPaid = Boolean(st.quota_paga);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Name & Email */}
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${
                            st.is_admin ? 'bg-rose-600' : isNovato ? 'bg-indigo-600' : 'bg-amber-500 text-slate-950'
                          }`}>
                            {st.nome_completo.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold">{st.nome_completo}</span>
                              {st.is_admin && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                                  ADMIN 👑
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal">{st.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                          isNovato ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {st.status_estudante}
                        </span>
                      </td>

                      {/* Quota Payment Indicator */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                            isQuotaPaid 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                              : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                          }`}>
                            {isQuotaPaid ? <CheckCircle2 className="w-3 h-3" /> : '⚠️'}
                            {isQuotaPaid ? 'PAGO' : 'PENDENTE'}
                          </span>
                          <span className="text-[11px] font-extrabold font-mono text-slate-800 dark:text-slate-200 block">
                            {(st.valor_quota || 10000).toLocaleString('pt-PT')} Kz
                          </span>
                          {st.confirmado_por_admin && (
                            <span className="text-[9px] text-slate-400 block font-mono">
                              Validador: {st.confirmado_por_admin}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Ano & Curso */}
                      <td className="p-4">
                        <span className="font-bold text-slate-900 dark:text-white block">{st.curso}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{st.ano_estudo}</span>
                      </td>

                      {/* Matrícula */}
                      <td className="p-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {st.matricula || 'N/A'}
                      </td>

                      {/* Admin Actions: Quota Toggle, Role Toggle & Delete Member */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Toggle Quota */}
                          <button
                            onClick={() => handleToggleQuota(st.id, st.quota_paga, st.nome_completo)}
                            title={isQuotaPaid ? 'Marcar como Pendente' : 'Confirmar Pagamento de Quota'}
                            className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1 ${
                              isQuotaPaid
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-600'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">
                              {isQuotaPaid ? 'Pendente' : 'Confirmar'}
                            </span>
                          </button>

                          {/* Toggle Admin Role */}
                          {st.id !== currentAdmin.id && (
                            <button
                              onClick={() => handleToggleAdminRole(st.id, Boolean(st.is_admin), st.nome_completo)}
                              title={st.is_admin ? 'Revogar privilégios de Admin' : 'Tornar Administrador'}
                              className={`p-1.5 rounded-xl transition-colors border ${
                                st.is_admin 
                                  ? 'border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900' 
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-indigo-600 dark:bg-slate-800 dark:border-slate-700'
                              }`}
                            >
                              <Shield className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete Member */}
                          <button
                            onClick={() => handleDeleteMember(st.id, st.nome_completo)}
                            title="Eliminar Membro do Sistema"
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredList.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div>
              A mostrar <span className="font-bold text-slate-900 dark:text-white">{startIndex + 1}</span> a{' '}
              <span className="font-bold text-slate-900 dark:text-white">
                {Math.min(startIndex + pageSize, totalRecords)}
              </span>{' '}
              de <span className="font-bold text-slate-900 dark:text-white">{totalRecords}</span> registos
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Página Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-bold px-2">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Página Seguinte"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Modal for Admin: Registar Novo Membro ou Administrador */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-xl shadow-2xl p-6 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Registar Novo Membro ou Admin
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Apenas administradores podem criar novas contas com função de Admin ou Estudante.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAdminCreateSubmit} className="mt-4 space-y-4">
              
              {/* Role Picker: Exclusivo para o Admin dentro do painel */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tipo de Conta a Criar <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setNewIsAdmin(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      !newIsAdmin
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    🎓 Estudante / Membro
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewIsAdmin(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      newIsAdmin
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    👑 Administrador
                  </button>
                </div>
              </div>

              {/* Personal Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newNome}
                    onChange={(e) => setNewNome(e.target.value)}
                    placeholder="Ex: João Baptista"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="joao@estudante.edu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Palavra-passe Inicial <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Telefone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={newTelefone}
                    onChange={(e) => setNewTelefone(e.target.value)}
                    placeholder="+244 923 000 000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Academic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estatuto
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as StatusEstudante)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Novo / Caloiro">Novo / Caloiro</option>
                    <option value="Antigo / Veterano">Antigo / Veterano</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ano de Estudo
                  </label>
                  <select
                    value={newAno}
                    onChange={(e) => setNewAno(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1º Ano">1º Ano</option>
                    <option value="2º Ano">2º Ano</option>
                    <option value="3º Ano / LST">3º Ano / LST</option>
                    <option value="Master 1">Master 1</option>
                    <option value="Master 2">Master 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Curso
                  </label>
                  <input
                    type="text"
                    required
                    value={newCurso}
                    onChange={(e) => setNewCurso(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Valor da Quota (Kz)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newQuotaVal}
                    onChange={(e) => setNewQuotaVal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  {createLoading ? 'A Registar...' : (newIsAdmin ? 'Criar Administrador 👑' : 'Criar Membro 🎓')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
