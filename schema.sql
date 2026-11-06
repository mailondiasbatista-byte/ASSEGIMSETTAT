-- ====================================================================
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
    valor_quota DECIMAL(10,2) DEFAULT 10000.00, -- Valor da Quota em Kz
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
);
