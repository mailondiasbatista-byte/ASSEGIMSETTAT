export type StatusEstudante = 'Novo / Caloiro' | 'Antigo / Veterano';

export interface Estudante {
  id: string; // UUID referencing auth.users.id
  nome_completo: string;
  email: string;
  telefone: string;
  status_estudante: StatusEstudante;
  ano_estudo: string; // e.g., '1º Ano', '2º Ano', '3º Ano / LST', 'Master 1', 'Master 2'
  curso: string;
  matricula: string;
  is_admin: boolean;
  quota_paga?: boolean; // Payment status of fee/dues
  valor_quota?: number; // Quota fee amount to be paid (e.g. 10000 Kz)
  data_pagamento?: string; // Date when admin confirmed payment
  confirmado_por_admin?: string; // Name of admin who confirmed
  created_at?: string;
  updated_at?: string;
}

export type AuthMode = 'login' | 'signup';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isMockMode: boolean;
}
