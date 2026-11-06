import React, { useState } from 'react';
import { Estudante, StatusEstudante } from '../types/supabase';
import { updateStudentProfile } from '../lib/studentService';
import { User, Mail, Phone, BookOpen, Hash, Calendar, Shield, Save, Star, ShieldCheck, CheckCircle2, Award, Edit3 } from 'lucide-react';

interface StudentDashboardProps {
  profile: Estudante;
  onUpdateProfile: (updated: Estudante) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  onRequestConfirm: (title: string, message: string, onConfirmAction: () => void) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  onUpdateProfile,
  onShowToast,
  onRequestConfirm,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit form state
  const [nomeCompleto, setNomeCompleto] = useState(profile.nome_completo);
  const [telefone, setTelefone] = useState(profile.telefone || '');
  const [statusEstudante, setStatusEstudante] = useState<StatusEstudante>(profile.status_estudante);
  const [anoEstudo, setAnoEstudo] = useState(profile.ano_estudo);
  const [curso, setCurso] = useState(profile.curso);
  const [matricula, setMatricula] = useState(profile.matricula || '');

  const isNovato = statusEstudante === 'Novo / Caloiro';

  const handleSaveProfile = () => {
    onRequestConfirm(
      'Atualizar Perfil Académico',
      'Confirma a alteração dos seus dados de estudante?',
      async () => {
        setLoading(true);
        const res = await updateStudentProfile(profile.id, {
          nome_completo: nomeCompleto,
          telefone,
          status_estudante: statusEstudante,
          ano_estudo: anoEstudo,
          curso,
          matricula,
        });
        setLoading(false);

        if (res.error) {
          onShowToast('Erro ao atualizar perfil', res.error, 'error');
        } else {
          onShowToast('Perfil Atualizado com Sucesso!', 'Os seus dados foram guardados no Supabase.', 'success');
          onUpdateProfile(res.profile);
          setIsEditing(false);
        }
      }
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* QUOTA PAYMENT ALERT BANNER */}
      {profile.quota_paga ? (
        <div className="p-5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border-2 border-emerald-500/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide flex items-center gap-2">
                Quota de Inscrição Confirmada ({(profile.valor_quota || 10000).toLocaleString('pt-PT')} Kz)
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                O seu pagamento de quota está regularizado e foi confirmado pelo Administrador 
                {profile.confirmado_por_admin ? ` (${profile.confirmado_por_admin})` : ''} 
                {profile.data_pagamento ? ` em ${new Date(profile.data_pagamento).toLocaleDateString('pt-PT')}` : ''}.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shrink-0 uppercase font-mono">
            ✅ PAGO ({(profile.valor_quota || 10000).toLocaleString('pt-PT')} Kz)
          </span>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-amber-500/15 dark:bg-amber-950/60 border-2 border-amber-500/50 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-950 dark:text-amber-200 animate-pulse-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-bold text-lg">
              ⚠️
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-amber-900 dark:text-amber-300">
                Aviso: Quota Pendente de Pagamento
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed">
                Valor a Pagar: <strong className="text-sm font-mono underline font-extrabold">{(profile.valor_quota || 10000).toLocaleString('pt-PT')} Kz</strong>. A sua quota consta como <strong>EM FALTA</strong>. Por favor regularize o valor e aguarde a validação do Administrador.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 shrink-0 uppercase shadow-sm font-mono">
            ⚠️ A PAGAR: {(profile.valor_quota || 10000).toLocaleString('pt-PT')} Kz
          </span>
        </div>
      )}

      {/* Student Welcome Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <img 
            src="/assets/aistudio/WhatsApp_Image_2026-11-02_at_21.28.45_6372fcd8.jpeg" 
            alt="Estudantes" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-indigo-950/70" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg border-2 border-white/20 ${
              isNovato ? 'bg-indigo-600' : 'bg-amber-500 text-slate-950'
            }`}>
              {profile.nome_completo.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                  isNovato ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30' : 'bg-amber-400/30 text-amber-200 border border-amber-400/30'
                }`}>
                  {isNovato ? <Star className="w-3 h-3 text-amber-400" /> : <ShieldCheck className="w-3 h-3 text-amber-400" />}
                  {profile.status_estudante}
                </span>

                {profile.is_admin && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950">
                    Administrador
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {profile.nome_completo}
              </h1>
              <p className="text-xs text-indigo-200 font-mono">
                Matrícula: {profile.matricula || 'N/A'} · {profile.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-md transition-colors flex items-center gap-2 shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Cancelar Edição' : 'Editar Dados Pessoais'}
          </button>

        </div>
      </div>

      {/* Main Student Profile & Edit Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Painel do Estudante · Ficha Académica
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing ? 'Edite os seus campos abaixo e confirme as alterações.' : 'Consulte as suas informações registadas no sistema universitário.'}
            </p>
          </div>
        </div>

        {isEditing ? (
          
          /* EDIT PROFILE FORM */
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail (Não editável)
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Número de Matrícula
                </label>
                <input
                  type="text"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status de Estudante
                </label>
                <select
                  value={statusEstudante}
                  onChange={(e) => setStatusEstudante(e.target.value as StatusEstudante)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Novo / Caloiro">Novo / Caloiro</option>
                  <option value="Antigo / Veterano">Antigo / Veterano</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ano de Estudo
                </label>
                <select
                  value={anoEstudo}
                  onChange={(e) => setAnoEstudo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1º Ano">1º Ano</option>
                  <option value="2º Ano">2º Ano</option>
                  <option value="3º Ano / LST">3º Ano / LST</option>
                  <option value="Master 1">Master 1</option>
                  <option value="Master 2">Master 2</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Curso / Faculdade
                </label>
                <input
                  type="text"
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={loading}
                className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? 'A guardar...' : 'Guardar Alterações'}
              </button>
            </div>
          </div>

        ) : (

          /* READ-ONLY CARD VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Académico</span>
              <div className="flex items-center gap-2 pt-0.5">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  isNovato ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  {profile.status_estudante}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ano de Estudo</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {profile.ano_estudo}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Número de Matrícula</span>
              <p className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                {profile.matricula || 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1 md:col-span-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Curso</span>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {profile.curso}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Telefone (WhatsApp)</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {profile.telefone || 'Sem telefone associado'}
              </p>
            </div>

          </div>

        )}

      </div>
    </div>
  );
};
