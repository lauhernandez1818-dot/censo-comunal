-- Ejecuta esto en Supabase > SQL Editor
-- Añade teléfono y cédula a usuarios, y crea tabla para códigos OTP

-- 1. Añadir columnas telefono y cedula a usuarios
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS telefono TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS cedula TEXT UNIQUE;

-- Actualizar usuarios admin existentes (opcional - puedes hacerlo manualmente)
-- UPDATE public.usuarios SET telefono = '04121234567', cedula = 'V12345678' WHERE usuario = 'YusleidyCN';
-- UPDATE public.usuarios SET telefono = '04121234568', cedula = 'V12345679' WHERE usuario = 'MeryCN';

-- 2. Crear tabla para códigos OTP temporales
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telefono TEXT NOT NULL,
  cedula TEXT NOT NULL,
  codigo TEXT NOT NULL,
  usado BOOLEAN DEFAULT FALSE,
  expira_en TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_otp_telefono_cedula ON public.otp_codes(telefono, cedula) WHERE usado = FALSE;
CREATE INDEX IF NOT EXISTS idx_otp_expira ON public.otp_codes(expira_en) WHERE usado = FALSE;

-- RLS para otp_codes
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on otp_codes" ON public.otp_codes;
CREATE POLICY "Allow all on otp_codes" ON public.otp_codes
  FOR ALL USING (true) WITH CHECK (true);

-- Función para limpiar códigos expirados automáticamente
CREATE OR REPLACE FUNCTION limpiar_otp_expirados()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_codes WHERE expira_en < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger para limpiar códigos expirados antes de insertar nuevos
CREATE OR REPLACE FUNCTION trigger_limpiar_otp()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.otp_codes WHERE expira_en < NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS limpiar_otp_antes_insert ON public.otp_codes;
CREATE TRIGGER limpiar_otp_antes_insert
  BEFORE INSERT ON public.otp_codes
  EXECUTE FUNCTION trigger_limpiar_otp();
