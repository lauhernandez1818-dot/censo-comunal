CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario TEXT UNIQUE NOT NULL,
  clave TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'jefa',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO usuarios (usuario, clave, rol) VALUES
  ('YusleidyCN', 'CN2026', 'admin'),
  ('MeryCN', 'CN2026$', 'admin')
ON CONFLICT (usuario) DO NOTHING;

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow usuarios" ON usuarios FOR ALL USING (true) WITH CHECK (true);

-- Tabla censo
CREATE TABLE IF NOT EXISTS censo_familias (
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

-- Si la tabla ya existe, agrega las columnas nuevas:
ALTER TABLE censo_familias ADD COLUMN IF NOT EXISTS nro_ninos INTEGER DEFAULT 0;
ALTER TABLE censo_familias ADD COLUMN IF NOT EXISTS nro_adultos INTEGER DEFAULT 0;
ALTER TABLE censo_familias ADD COLUMN IF NOT EXISTS nro_adultos_mayores INTEGER DEFAULT 0;
ALTER TABLE censo_familias ADD COLUMN IF NOT EXISTS usuario_creador TEXT;

ALTER TABLE censo_familias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on censo_familias" ON censo_familias 
  FOR ALL USING (true) WITH CHECK (true);

-- Para actualización en tiempo real: Dashboard > Database > Replication
-- Activa la tabla censo_familias en la publicación "supabase_realtime"
