-- Pega esto en Supabase > SQL Editor > pestaña "Censo_Familias" o "Usuarios and Censo Familias schema"
-- Arregla censo_familias para que la app pueda guardar (añade columnas que falten)

-- Si tu tabla tiene la columna "integrantes" en vez de "nro_integrantes", la renombramos:
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'censo_familias' AND column_name = 'integrantes'
  ) THEN
    ALTER TABLE public.censo_familias RENAME COLUMN integrantes TO nro_integrantes;
  END IF;
END $$;

-- Añadir todas las columnas que la app envía (si no existen):
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS nro_integrantes INTEGER;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS nro_ninos INTEGER DEFAULT 0;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS nro_adultos INTEGER DEFAULT 0;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS nro_adultos_mayores INTEGER DEFAULT 0;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS discapacidad BOOLEAN DEFAULT FALSE;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS discapacidad_condicion TEXT DEFAULT 'ninguna';
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS discapacidad_condicion_detalle TEXT;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS salud_observacion TEXT;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS estado_vivienda TEXT DEFAULT 'Bueno';
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS nudo_critico TEXT;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS usuario_creador TEXT;
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- RLS para que la app pueda leer y escribir:
ALTER TABLE public.censo_familias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on censo_familias" ON public.censo_familias;
CREATE POLICY "Allow all on censo_familias" ON public.censo_familias
  FOR ALL USING (true) WITH CHECK (true);
