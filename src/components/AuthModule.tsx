import React, { useState } from 'react';
import { AuthMode, StatusEstudante, Estudante } from '../types/supabase';
import { signUpStudent, signInStudent } from '../lib/studentService';
import { Lock, Mail, User, Phone, BookOpen, Hash, ShieldCheck, ArrowRight, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

interface AuthModuleProps {
  onAuthSuccess: (profile: Estudante) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const AuthModule: React.FC<AuthModuleProps> = ({
  onAuthSuccess,
  onShowToast,
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login Form fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form fields
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [statusEstudante, setStatusEstudante] = useState<StatusEstudante>('Novo / Caloiro');
  const [anoEstudo, setAnoEstudo] = useState('1º Ano');
  const [curso, setCurso] = useState('Engenharia Informática');
  const [matricula, setMatricula] = useState(() => `2026${Math.floor(1000 + Math.random() * 9000)}`);
  const [valorQuota, setValorQuota] = useState<number>(10000);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Client Validation Helper
  const validateForm = (): boolean => {
    setErrorMessage('');

    if (authMode === 'login') {
      if (!loginEmail.trim() || !loginEmail.includes('@')) {
        setErrorMessage('Por favor insira um endereço de e-mail válido.');
        return false;
      }
      if (!loginPassword || loginPassword.length < 6) {
        setErrorMessage('A palavra-passe deve conter pelo menos 6 caracteres.');
        return false;
      }
      return true;
    }

    // Signup Validation
    if (!fullName.trim()) {
      setErrorMessage('O Nome Completo é obrigatório.');
      return false;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setErrorMessage('Por favor insira um e-mail válido.');
      return false;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setErrorMessage('A palavra-passe deve ter pelo menos 6 caracteres.');
      return false;
    }
    if (signUpPassword !== confirmPassword) {
      setErrorMessage('As palavras-passe não coincidem.');
      return false;
    }
    if (!curso.trim()) {
      setErrorMessage('O Curso é obrigatório.');
      return false;
    }

    return true;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');
    setSuccessBanner(null);

    const res = await signInStudent(loginEmail.trim(), loginPassword);
    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
      onShowToast('Falha na Autenticação', res.error, 'error');
    } else {
      onShowToast(`Bem-vindo, ${res.profile.nome_completo}!`, 'Sessão iniciada com sucesso.', 'success');
      onAuthSuccess(res.profile);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');
    setSuccessBanner(null);

    const res = await signUpStudent({
      email: signUpEmail.trim(),
      password: signUpPassword,
      nome_completo: fullName.trim(),
      telefone: phone.trim(),
      status_estudante: statusEstudante,
      ano_estudo: anoEstudo,
      curso: curso.trim(),
      matricula: matricula.trim(),
      valor_quota: Number(valorQuota) || 10000,
      is_admin: false,
    });

    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
      onShowToast('Erro ao criar conta', res.error, 'error');
    } else {
      // Auto redirect to Login tab without requiring manual 'Sair' click!
      const userMail = signUpEmail.trim();
      setLoginEmail(userMail);
      setLoginPassword('');
      setAuthMode('login');

      const msg = `🎉 Cadastro efetuado com sucesso! A conta do estudante ${fullName.trim()} foi registada. Faça login com as suas credenciais para aceder.`;
      setSuccessBanner(msg);
      onShowToast('Cadastro Concluído com Sucesso!', 'Sua conta foi registada. Faça login para continuar.', 'success');
      
      // Reset signup fields
      setFullName('');
      setSignUpEmail('');
      setSignUpPassword('');
      setConfirmPassword('');
      setPhone('');
    }
  };

  // Demo Shortcut Login handlers
  const handleQuickDemoStudent = async () => {
    setLoading(true);
    const res = await signInStudent('manuel.mateus@estudante.edu', '123456');
    setLoading(false);
    if (res.profile) {
      onShowToast('Sessão iniciada como Estudante Demo', undefined, 'success');
      onAuthSuccess(res.profile);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setLoading(true);
    const res = await signInStudent('admin@universidade.edu', '123456');
    setLoading(false);
    if (res.profile) {
      onShowToast('Sessão de Administrador Iniciada', 'Acesso total concedido.', 'success');
      onAuthSuccess(res.profile);
    }
  };

  return (
    <div className="w-full py-2">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* Left Column: Community Photo Hero & System Overview */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-8">
            <img 
              src="/assets/aistudio/WhatsApp_Image_2026-11-02_at_21.28.45_6372fcd8.jpeg" 
              alt="Comunidade Académica" 
              className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

            <div className="relative z-10 space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-slate-900/80 px-3 py-1 rounded-full border border-amber-400/30 backdrop-blur-sm inline-block">
                Plataforma Universitária
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Registo de Novatos & Anciãos
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sistema centralizado para cadastro de novos estudantes, acompanhamento de veteranos e controlo administrativo do pagamento de quotas.
              </p>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Acesso Rápido para Demonstração:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoStudent}
                  disabled={loading}
                  className="px-3 py-2 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  Entrar como Estudante
                </button>
                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  disabled={loading}
                  className="px-3 py-2 text-xs font-bold text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Entrar como Admin
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Auth Form (Login / Register) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-slate-900">
            <div>
              {/* Auth Tabs Header */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-4 text-xs sm:text-sm font-bold text-center transition-colors border-b-2 ${
                    authMode === 'login'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Iniciar Sessão (Login)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-4 text-xs sm:text-sm font-bold text-center transition-colors border-b-2 ${
                    authMode === 'signup'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Criar Conta de Estudante
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Success Redirect Banner */}
                {successBanner && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-start gap-3 text-emerald-900 dark:text-emerald-200 text-xs animate-slide-up">
                    <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-sm block">Cadastro Concluído!</span>
                      <p>{successBanner}</p>
                    </div>
                  </div>
                )}

                {/* Error Message Box */}
                {errorMessage && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs animate-shake">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {authMode === 'login' ? (
                  
                  /* LOGIN FORM */
                  <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md mx-auto py-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Endereço de E-mail <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="estudante@universidade.edu"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Palavra-passe <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      {loading ? 'A autenticar...' : 'Entrar na Plataforma'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                ) : (

                  /* SIGNUP FORM */
                  <form onSubmit={handleSignUpSubmit} className="space-y-4">
                    
                    {/* Account Credentials */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Nome Completo <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ex: Mateus Silva"
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                          />
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          E-mail <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={signUpEmail}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            placeholder="seu.email@estudante.edu"
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                          />
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Palavra-passe (Mínimo 6 caracteres) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                          />
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Confirmar Palavra-passe <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                          />
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>
                    </div>

                    {/* Academic Profile Details */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                        Dados Académicos do Estudante
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Estatuto de Estudante
                          </label>
                          <select
                            value={statusEstudante}
                            onChange={(e) => setStatusEstudante(e.target.value as StatusEstudante)}
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
                            value={anoEstudo}
                            onChange={(e) => setAnoEstudo(e.target.value)}
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
                            Curso <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={curso}
                            onChange={(e) => setCurso(e.target.value)}
                            placeholder="Ex: Engenharia Informática"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Telefone (WhatsApp)
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+244 923 000 000"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Valor da Quota / Propina (Kz)
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={valorQuota}
                            onChange={(e) => setValorQuota(Number(e.target.value))}
                            placeholder="10000"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      {loading ? 'A criar conta...' : 'Criar Conta & Registar Estudante'}
                    </button>
                  </form>

                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
