import React, { useState, useEffect } from 'react';
import { Estudante } from './types/supabase';
import { getCurrentSession, signOutStudent } from './lib/studentService';
import { currentConfig } from './lib/supabaseClient';
import { AuthModule } from './components/AuthModule';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SqlSchemaModal } from './components/SqlSchemaModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { GraduationCap, LogOut, User, ShieldCheck, Database, Sun, Moon, Sparkles } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(() => getCurrentSession());
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  
  // Modals and Feedback
  const [sqlModalOpen, setSqlModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirmAction: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirmAction: () => {},
  });

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Toast Handler
  const showToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Confirmation Modal Request
  const requestConfirm = (title: string, message: string, onConfirmAction: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirmAction,
    });
  };

  // Auth Handlers
  const handleAuthSuccess = (profile: Estudante) => {
    setSession({ user: { id: profile.id, email: profile.email }, profile });
    if (profile.is_admin) {
      setActiveTab('admin');
    } else {
      setActiveTab('student');
    }
  };

  const handleLogout = () => {
    requestConfirm(
      'Terminar Sessão',
      'Tem a certeza de que pretende sair da sua conta?',
      async () => {
        await signOutStudent();
        setSession({ user: null, profile: null });
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast('Sessão Terminada', 'A sua sessão foi encerrada com sucesso.', 'info');
      }
    );
  };

  const profile = session.profile;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white relative">
      
      {/* Full Page Fixed Background Photo */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-35 dark:opacity-40 transition-opacity">
        <img 
          src="/assets/aistudio/WhatsApp_Image_2026-11-02_at_21.28.45_6372fcd8.jpeg" 
          alt="Comunidade de Estudantes" 
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-950/60 to-slate-950/80 dark:from-slate-950/60 dark:via-slate-950/80 dark:to-slate-950/95" />
      </div>

      {/* Top Header Contract */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 block">
                  Gestão de Estudantes
                </span>
              </div>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden md:flex items-center gap-2">
              {profile && (
                <>
                  <button
                    onClick={() => setActiveTab('student')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                      activeTab === 'student'
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Painel do Estudante
                  </button>

                  {profile.is_admin && (
                    <button
                      onClick={() => setActiveTab('admin')}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                        activeTab === 'admin'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Painel de Administração
                    </button>
                  )}
                </>
              )}

              <button
                onClick={() => setSqlModalOpen(true)}
                className="px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Database className="w-4 h-4" />
                Script SQL (schema.sql)
              </button>
            </nav>

            {/* Zone 3: Actions & Theme */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>

              {profile ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              ) : (
                <button
                  onClick={() => setSqlModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <Database className="w-4 h-4" />
                  Ver SQL Supabase
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area - Full Width */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-6">
        {!profile ? (
          <AuthModule
            onAuthSuccess={handleAuthSuccess}
            onShowToast={showToast}
          />
        ) : activeTab === 'admin' && profile.is_admin ? (
          <AdminDashboard
            currentAdmin={profile}
            onShowToast={showToast}
            onRequestConfirm={requestConfirm}
          />
        ) : (
          <StudentDashboard
            profile={profile}
            onUpdateProfile={(updated) => setSession({ ...session, profile: updated })}
            onShowToast={showToast}
            onRequestConfirm={requestConfirm}
          />
        )}
      </main>

      {/* SQL Schema Modal */}
      <SqlSchemaModal
        isOpen={sqlModalOpen}
        onClose={() => setSqlModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={() => {
          confirmModal.onConfirmAction();
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Feedback Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Footer - Full Width */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          Aplicação de Gestão de Estudantes · Supabase Backend Integration
        </div>
      </footer>

    </div>
  );
}
