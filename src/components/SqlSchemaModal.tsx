import React, { useState } from 'react';
import { X, Copy, Check, Download, Database, KeyRound, ExternalLink } from 'lucide-react';
import { currentConfig, saveSupabaseConfig } from '../lib/supabaseClient';

interface SqlSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error') => void;
}

const SQL_SCRIPT = `-- ====================================================================
-- SCRIPT SQL SUPABASE - TABELA ESTUDANTES, TRIGGERS E POLÍTICAS RLS
-- Executar no Editor SQL do Supabase (SQL Editor)
-- ====================================================================

-- 1. Criar tipo ENUM para o Status do Estudante
DO $$ BEGIN
    CREATE TYPE status_estudante_enum AS ENUM ('Novo / Caloiro', 'Antigo / Veterano');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Criar a Tabela 'estudantes'
CREATE TABLE IF NOT EXISTS public.estudantes (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(50),
    status_estudante status_estudante_enum NOT NULL DEFAULT 'Novo / Caloiro',
    ano_estudo VARCHAR(50) NOT NULL DEFAULT '1º Ano',
    curso VARCHAR(150) NOT NULL,
    matricula VARCHAR(50) UNIQUE,
    is_admin BOOLEAN DEFAULT FALSE,
    quota_paga BOOLEAN DEFAULT FALSE, -- Alerta e Controlo de Quotas
    data_pagamento TIMESTAMPTZ,
    confirmado_por_admin VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexação para buscas de alto desempenho
CREATE INDEX IF NOT EXISTS idx_estudantes_email ON public.estudantes(email);
CREATE INDEX IF NOT EXISTS idx_estudantes_matricula ON public.estudantes(matricula);
CREATE INDEX IF NOT EXISTS idx_estudantes_created_at ON public.estudantes(created_at DESC);

-- 3. Função e Trigger para atualizar automaticamente 'updated_at'
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_estudantes_updated_at ON public.estudantes;
CREATE TRIGGER trigger_update_estudantes_updated_at
BEFORE UPDATE ON public.estudantes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.estudantes ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Segurança (Row Level Security - RLS)

-- Política de Inserção: Permite que novos usuários autenticados registrem seu próprio perfil
DROP POLICY IF EXISTS "Permitir inserção do próprio perfil" ON public.estudantes;
CREATE POLICY "Permitir inserção do próprio perfil"
ON public.estudantes FOR INSERT
WITH CHECK (auth.uid() = id);

-- Política de Leitura: Usuário visualiza seus próprios dados OU administradores visualizam tudo
DROP POLICY IF EXISTS "Permitir leitura ao próprio estudante ou admin" ON public.estudantes;
CREATE POLICY "Permitir leitura ao próprio estudante ou admin"
ON public.estudantes FOR SELECT
USING (
    auth.uid() = id OR 
    EXISTS (
        SELECT 1 FROM public.estudantes 
        WHERE id = auth.uid() AND is_admin = TRUE
    )
);

-- Política de Atualização: Usuário edita seus próprios dados OU administradores editam tudo
DROP POLICY IF EXISTS "Permitir atualização ao próprio estudante ou admin" ON public.estudantes;
CREATE POLICY "Permitir atualização ao próprio estudante ou admin"
ON public.estudantes FOR UPDATE
USING (
    auth.uid() = id OR 
    EXISTS (
        SELECT 1 FROM public.estudantes 
        WHERE id = auth.uid() AND is_admin = TRUE
    )
)
WITH CHECK (
    auth.uid() = id OR 
    EXISTS (
        SELECT 1 FROM public.estudantes 
        WHERE id = auth.uid() AND is_admin = TRUE
    )
);

-- Política de Remoção: Apenas administradores podem deletar registros
DROP POLICY IF EXISTS "Permitir exclusão apenas para administradores" ON public.estudantes;
CREATE POLICY "Permitir exclusão apenas para administradores"
ON public.estudantes FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.estudantes 
        WHERE id = auth.uid() AND is_admin = TRUE
    )
);`;

export const SqlSchemaModal: React.FC<SqlSchemaModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'config'>('sql');
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.anonKey);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopied(true);
    onShowToast('Script SQL copiado com sucesso!', 'Cole no SQL Editor do seu projeto Supabase.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SQL_SCRIPT], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.sql';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Ficheiro schema.sql descarregado!', undefined, 'success');
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseKey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Supabase SQL & Configuração
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentConfig.isMockMode ? 'Modo de Teste Local Ativo' : 'Conectado ao Supabase Cloud'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="px-6 pt-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex gap-2">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 ${
              activeTab === 'sql'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Script SQL (schema.sql)
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Configurar Credenciais Supabase
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'sql' ? (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <span>Copie este script e execute diretamente no <strong>SQL Editor</strong> do seu painel Supabase.</span>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleCopySql}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copiado!' : 'Copiar SQL'}
                  </button>
                  <button
                    onClick={handleDownloadSql}
                    className="px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-200 rounded-lg border border-slate-300 dark:border-slate-600 transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar .sql
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-[350px] leading-relaxed select-all">
                {SQL_SCRIPT}
              </pre>
            </>
          ) : (
            <form onSubmit={handleSaveCredentials} className="space-y-4 max-w-lg mx-auto py-2">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                <span className="font-bold block">Conectar Projeto Supabase Real:</span>
                <p>Insira a URL do seu projeto e a Chave Pública Anon obtidas no painel do Supabase em <i>Settings &gt; API</i>.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  SUPABASE_URL
                </label>
                <input
                  type="url"
                  placeholder="https://xyz.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  SUPABASE_ANON_KEY
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSupabaseUrl('');
                    setSupabaseKey('');
                    saveSupabaseConfig('', '');
                  }}
                  className="text-xs font-semibold text-rose-500 hover:underline"
                >
                  Restaurar Modo Demo Local
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
                >
                  Guardar e Recarregar
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
