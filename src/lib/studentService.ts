import { supabase, currentConfig, INITIAL_MOCK_ESTUDANTES } from './supabaseClient';
import { Estudante, StatusEstudante } from '../types/supabase';

const LOCAL_MOCK_KEY = 'supabase_mock_estudantes_v2';
const CURRENT_USER_KEY = 'supabase_mock_session_user';

// Get local mock dataset
function getLocalMockEstudantes(): Estudante[] {
  try {
    const saved = localStorage.getItem(LOCAL_MOCK_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_MOCK_ESTUDANTES;
}

function saveLocalMockEstudantes(list: Estudante[]) {
  localStorage.setItem(LOCAL_MOCK_KEY, JSON.stringify(list));
}

// Current logged in session user profile
export function getCurrentSession(): { user: any; profile: Estudante | null } {
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return { user: null, profile: null };
}

export function saveCurrentSession(session: { user: any; profile: Estudante | null } | null) {
  if (session && session.profile) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

// 1. Sign Up Student (Auth + Database Insert)
export async function signUpStudent(data: {
  email: string;
  password: string;
  nome_completo: string;
  telefone: string;
  status_estudante: StatusEstudante;
  ano_estudo: string;
  curso: string;
  matricula: string;
  valor_quota?: number;
  is_admin?: boolean;
}): Promise<{ profile: Estudante; error?: string }> {
  const { 
    email, 
    password, 
    nome_completo, 
    telefone, 
    status_estudante, 
    ano_estudo, 
    curso, 
    matricula, 
    valor_quota = 10000,
    is_admin = false 
  } = data;

  if (currentConfig.isMockMode) {
    // Mock Mode Execution
    const list = getLocalMockEstudantes();
    const existing = list.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { profile: null as any, error: 'Este e-mail já está registado.' };
    }

    const newUuid = `user-uuid-${Date.now()}`;
    const newEstudante: Estudante = {
      id: newUuid,
      nome_completo,
      email,
      telefone: telefone || '+244 900 000 000',
      status_estudante,
      ano_estudo,
      curso,
      matricula: matricula || `MAT-${Math.floor(100000 + Math.random() * 900000)}`,
      is_admin,
      quota_paga: false,
      valor_quota,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updatedList = [newEstudante, ...list];
    saveLocalMockEstudantes(updatedList);
    
    return { profile: newEstudante };
  }

  // Real Supabase Auth Execution
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      return { profile: null as any, error: authError?.message || 'Falha ao criar conta.' };
    }

    const userId = authData.user.id;
    const newEstudante: Estudante = {
      id: userId,
      nome_completo,
      email,
      telefone: telefone || '',
      status_estudante,
      ano_estudo,
      curso,
      matricula: matricula || `MAT-${Math.floor(100000 + Math.random() * 900000)}`,
      is_admin,
      quota_paga: false,
      valor_quota,
    };

    const { data: dbData, error: dbError } = await supabase
      .from('estudantes')
      .insert([newEstudante])
      .select()
      .single();

    if (dbError) {
      return { profile: null as any, error: dbError.message || 'Erro ao guardar dados do estudante.' };
    }

    return { profile: dbData };
  } catch (err: any) {
    return { profile: null as any, error: err.message || 'Ocorreu um erro no servidor.' };
  }
}

// 2. Sign In Student
export async function signInStudent(email: string, password: string): Promise<{ profile: Estudante; error?: string }> {
  if (currentConfig.isMockMode) {
    const list = getLocalMockEstudantes();
    const found = list.find(s => s.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      return { profile: null as any, error: 'Credenciais inválidas ou utilizador não encontrado.' };
    }

    const sessionData = { user: { id: found.id, email: found.email }, profile: found };
    saveCurrentSession(sessionData);

    return { profile: found };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return { profile: null as any, error: authError?.message || 'Credenciais inválidas.' };
    }

    const { data: profile, error: dbError } = await supabase
      .from('estudantes')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (dbError || !profile) {
      return { profile: null as any, error: 'Perfil de estudante não encontrado no banco de dados.' };
    }

    const sessionData = { user: authData.user, profile };
    saveCurrentSession(sessionData);

    return { profile };
  } catch (err: any) {
    return { profile: null as any, error: err.message || 'Erro de ligação ao Supabase.' };
  }
}

// 3. Sign Out
export async function signOutStudent(): Promise<void> {
  saveCurrentSession(null);
  if (!currentConfig.isMockMode) {
    try {
      await supabase.auth.signOut();
    } catch {}
  }
}

// 4. Update Profile
export async function updateStudentProfile(userId: string, data: Partial<Estudante>): Promise<{ profile: Estudante; error?: string }> {
  if (currentConfig.isMockMode) {
    const list = getLocalMockEstudantes();
    const updatedList = list.map(s => {
      if (s.id === userId) {
        return { ...s, ...data, updated_at: new Date().toISOString() };
      }
      return s;
    });

    saveLocalMockEstudantes(updatedList);
    const updatedProfile = updatedList.find(s => s.id === userId)!;
    const session = getCurrentSession();
    if (session.user) {
      saveCurrentSession({ user: session.user, profile: updatedProfile });
    }

    return { profile: updatedProfile };
  }

  try {
    const { data: updated, error } = await supabase
      .from('estudantes')
      .update(data)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return { profile: null as any, error: error.message };
    }

    const session = getCurrentSession();
    if (session.user) {
      saveCurrentSession({ user: session.user, profile: updated });
    }

    return { profile: updated };
  } catch (err: any) {
    return { profile: null as any, error: err.message };
  }
}

// 5. Fetch all students for Admin Dashboard
export async function fetchAdminEstudantesList(): Promise<{ data: Estudante[]; error?: string }> {
  if (currentConfig.isMockMode) {
    const list = getLocalMockEstudantes();
    return { data: list };
  }

  try {
    const { data, error } = await supabase
      .from('estudantes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: data || [] };
  } catch (err: any) {
    return { data: [], error: err.message };
  }
}

// 6. Admin exclusive action: Toggle Quota Payment Confirmation
export async function toggleStudentQuotaPayment(
  studentId: string, 
  isPaid: boolean, 
  adminName: string
): Promise<{ profile: Estudante; error?: string }> {
  const payload = {
    quota_paga: isPaid,
    data_pagamento: isPaid ? new Date().toISOString() : null,
    confirmado_por_admin: isPaid ? adminName : null,
  };

  if (currentConfig.isMockMode) {
    const list = getLocalMockEstudantes();
    const updatedList = list.map(s => {
      if (s.id === studentId) {
        return { 
          ...s, 
          quota_paga: isPaid,
          data_pagamento: isPaid ? new Date().toISOString() : undefined,
          confirmado_por_admin: isPaid ? adminName : undefined,
          updated_at: new Date().toISOString() 
        };
      }
      return s;
    });

    saveLocalMockEstudantes(updatedList);
    const updatedProfile = updatedList.find(s => s.id === studentId)!;
    return { profile: updatedProfile };
  }

  try {
    const { data: updated, error } = await supabase
      .from('estudantes')
      .update(payload)
      .eq('id', studentId)
      .select()
      .single();

    if (error) {
      return { profile: null as any, error: error.message };
    }

    return { profile: updated };
  } catch (err: any) {
    return { profile: null as any, error: err.message };
  }
}

// 7. Admin exclusive action: Delete Student Profile
export async function deleteStudentProfile(studentId: string): Promise<{ success: boolean; error?: string }> {
  if (currentConfig.isMockMode) {
    const list = getLocalMockEstudantes();
    const updatedList = list.filter(s => s.id !== studentId);
    saveLocalMockEstudantes(updatedList);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('estudantes')
      .delete()
      .eq('id', studentId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 8. Admin exclusive action: Toggle Admin Role
export async function toggleAdminRole(studentId: string, isAdmin: boolean): Promise<{ profile: Estudante; error?: string }> {
  return updateStudentProfile(studentId, { is_admin: isAdmin });
}
