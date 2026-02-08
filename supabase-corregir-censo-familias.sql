-- Ejecuta en Supabase: Dashboard > SQL Editor > New query
-- Corrige el esquema para que coincida con lo que envía la app (nro_integrantes, etc.)

-- Si la columna se llama "integrantes", renómbrala a "nro_integrantes"
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'censo_familias' AND column_name = 'integrantes'
    ) THEN
      ALTER TABLE public.censo_familias RENAME COLUMN integrantes TO nro_integrantes;
    END IF;
  END $$;

  -- Agrega las columnas que falten (nro_integrantes ya existe si se renombró arriba)
  ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS nro_ninos INTEGER DEFAULT 0;
  ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS nro_adultos INTEGER DEFAULT 0;
  ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS nro_adultos_mayores INTEGER DEFAULT 0;
  ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS discapacidad BOOLEAN DEFAULT FALSE;
  ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS salud_observacion TEXT;
  ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS estado_vivienda TEXT DEFAULT 'Bueno';
  ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS nudo_critico TEXT;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS usuario_creador TEXT;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS discapacidad_condicion TEXT DEFAULT 'ninguna';
