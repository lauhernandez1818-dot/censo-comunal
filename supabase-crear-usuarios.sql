-- Ejecuta este SQL en Supabase: Dashboard > SQL Editor > New query
-- Resuelve el error: "Could not find the table 'public.usuarios' in the schema cache"

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
