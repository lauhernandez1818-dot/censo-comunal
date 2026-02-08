-- Ejecuta este SQL en Supabase: Dashboard > SQL Editor > New query
-- Crea la tabla censo_familias para que funcione el registro de familias

CREATE TABLE IF NOT EXISTS public.censo_familias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jefe_familia TEXT NOT NULL,
  cedula TEXT NOT NULL,
  nro_integrantes INTEGER NOT NULL,
  nro_ninos INTEGER DEFAULT 0,
  nro_adultos INTEGER DEFAULT 0,
  nro_adultos_mayores INTEGER DEFAULT 0,
  discapacidad BOOLEAN DEFAULT FALSE,
  salud_observacion TEXT,
  estado_vivienda TEXT NOT NULL DEFAULT 'Bueno',
  nudo_critico TEXT,
  usuario_creador TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la tabla ya existe, agrega las columnas que falten:
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS nro_ninos INTEGER DEFAULT 0;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS nro_adultos INTEGER DEFAULT 0;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS nro_adultos_mayores INTEGER DEFAULT 0;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS usuario_creador TEXT;

ALTER TABLE public.censo_familias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on censo_familias" ON public.censo_familias;
CREATE POLICY "Allow all on censo_familias" ON public.censo_familias
  FOR ALL USING (true) WITH CHECK (true);
