-- Ejecuta TODO este SQL en Supabase: Dashboard > SQL Editor > New query
-- Crea desde cero las tablas usuarios y censo_familias

-- 1. Tabla usuarios (login y registro)
CREATE TABLE IF NOT EXISTS public.usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario TEXT UNIQUE NOT NULL,
  clave TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'jefa',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.usuarios (usuario, clave, rol) VALUES
  ('YusleidyCN', 'CN2026', 'admin'),
  ('MeryCN', 'CN2026$', 'admin')
ON CONFLICT (usuario) DO NOTHING;

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow usuarios" ON public.usuarios;
CREATE POLICY "Allow usuarios" ON public.usuarios
  FOR ALL USING (true) WITH CHECK (true);

-- 2. Tabla censo_familias (registro de familias)
CREATE TABLE IF NOT EXISTS public.censo_familias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jefe_familia TEXT NOT NULL,
  cedula TEXT NOT NULL,
  nro_integrantes INTEGER NOT NULL,
  nro_ninos INTEGER DEFAULT 0,
  nro_adultos INTEGER DEFAULT 0,
  nro_adultos_mayores INTEGER DEFAULT 0,
  discapacidad BOOLEAN DEFAULT FALSE,
  discapacidad_condicion TEXT DEFAULT 'ninguna',
  discapacidad_condicion_detalle TEXT,
  salud_observacion TEXT,
  estado_vivienda TEXT NOT NULL DEFAULT 'Bueno',
  nudo_critico TEXT,
  usuario_creador TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.censo_familias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on censo_familias" ON public.censo_familias;
CREATE POLICY "Allow all on censo_familias" ON public.censo_familias
  FOR ALL USING (true) WITH CHECK (true);
