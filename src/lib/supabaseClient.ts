import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Estudante, SupabaseConfig } from '../types/supabase';

// Retrieve environment variables or check localStorage override
const getInitialConfig = (): SupabaseConfig => {
  const customUrl = localStorage.getItem('supabase_url');
  const customKey = localStorage.getItem('supabase_anon_key');
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const url = customUrl || envUrl || '';
  const anonKey = customKey || envKey || '';

  // Valid if starts with https:// and non-empty key
  const isValid = Boolean(url && url.startsWith('https://') && anonKey && anonKey.length > 20);

  return {
    url,
    anonKey,
    isMockMode: !isValid
  };
};

export const currentConfig = getInitialConfig();

// Create official Supabase client instance if valid keys provided
export const supabase: SupabaseClient = currentConfig.isMockMode
  ? (createClient('https://mock-app.supabase.co', 'mock-anon-key-placeholder') as any)
  : createClient(currentConfig.url, currentConfig.anonKey);

export function saveSupabaseConfig(url: string, key: string) {
  if (url && key) {
    localStorage.setItem('supabase_url', url.trim());
    localStorage.setItem('supabase_anon_key', key.trim());
  } else {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_anon_key');
  }
  window.location.reload();
}

// Default initial mock students store for local fallback/demonstration
export const INITIAL_MOCK_ESTUDANTES: Estudante[] = [
  {
    id: 'admin-uuid-0000-0000-000000000001',
    nome_completo: 'Dra. Luísa Fernandes (Administradora)',
    email: 'admin@universidade.edu',
    telefone: '+244 923 000 111',
    status_estudante: 'Antigo / Veterano',
    ano_estudo: 'Master 2',
    curso: 'Engenharia de Software & Sistemas',
    matricula: 'ADM-2023001',
    is_admin: true,
    quota_paga: true,
    valor_quota: 10000,
    data_pagamento: '2026-10-01T08:00:00Z',
    confirmado_por_admin: 'Administração Geral',
    created_at: '2026-10-01T08:00:00Z',
    updated_at: '2026-10-01T08:00:00Z'
  },
  {
    id: 'user-uuid-0000-0000-000000000002',
    nome_completo: 'Manuel Domingos Mateus',
    email: 'manuel.mateus@estudante.edu',
    telefone: '+244 912 345 678',
    status_estudante: 'Novo / Caloiro',
    ano_estudo: '1º Ano',
    curso: 'Engenharia Informática',
    matricula: '20261001',
    is_admin: false,
    quota_paga: false, // Quota Pendente
    valor_quota: 10000,
    created_at: '2026-10-25T10:30:00Z',
    updated_at: '2026-10-25T10:30:00Z'
  },
  {
    id: 'user-uuid-0000-0000-000000000003',
    nome_completo: 'Ana Cláudia Silva Santos',
    email: 'ana.santos@estudante.edu',
    telefone: '+244 934 567 890',
    status_estudante: 'Antigo / Veterano',
    ano_estudo: '3º Ano / LST',
    curso: 'Medicina & Ciências da Saúde',
    matricula: '20240045',
    is_admin: false,
    quota_paga: true,
    valor_quota: 10000,
    data_pagamento: '2026-10-21T10:00:00Z',
    confirmado_por_admin: 'Dra. Luísa Fernandes',
    created_at: '2026-10-20T14:15:00Z',
    updated_at: '2026-10-20T14:15:00Z'
  },
  {
    id: 'user-uuid-0000-0000-000000000004',
    nome_completo: 'Cláudio Ferreira Baptista',
    email: 'claudio.baptista@estudante.edu',
    telefone: '+244 945 678 901',
    status_estudante: 'Novo / Caloiro',
    ano_estudo: '1º Ano',
    curso: 'Gestão de Empresas',
    matricula: '20261002',
    is_admin: false,
    quota_paga: false, // Quota Pendente
    valor_quota: 10000,
    created_at: '2026-10-26T09:00:00Z',
    updated_at: '2026-10-26T09:00:00Z'
  },
  {
    id: 'user-uuid-0000-0000-000000000005',
    nome_completo: 'Esperança Maria Pedro',
    email: 'esperanca.pedro@estudante.edu',
    telefone: '+244 921 987 654',
    status_estudante: 'Antigo / Veterano',
    ano_estudo: 'Master 1',
    curso: 'Direito & Relações Internacionais',
    matricula: '20220112',
    is_admin: false,
    quota_paga: true,
    valor_quota: 10000,
    data_pagamento: '2026-10-19T14:00:00Z',
    confirmado_por_admin: 'Dra. Luísa Fernandes',
    created_at: '2026-10-18T11:20:00Z',
    updated_at: '2026-10-18T11:20:00Z'
  }
];
