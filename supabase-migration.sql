-- Ejecuta este SQL en el editor SQL de tu proyecto Supabase
-- (Dashboard > SQL Editor > New query)

-- Tabla de usuarios (login y registro)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario TEXT UNIQUE NOT NULL,
  clave TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'jefa',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar administradoras (YusleidyCN y MeryCN)
INSERT INTO usuarios (usuario, clave, rol) VALUES
  ('YusleidyCN', 'CN2026', 'admin'),
  ('MeryCN', 'CN2026$', 'admin')
ON CONFLICT (usuario) DO NOTHING;

-- Tabla de familias del censo
CREATE TABLE IF NOT EXISTS familias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jefe_familia TEXT NOT NULL,
  cedula TEXT NOT NULL,
  nro_integrantes INTEGER NOT NULL,
  hay_discapacidad BOOLEAN DEFAULT FALSE,
  detalles_discapacidad TEXT,
  situacion_vivienda TEXT NOT NULL DEFAULT 'Buena',
  nudo_critico_especifico TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE familias ENABLE ROW LEVEL SECURITY;

-- Políticas: permitir acceso para la app (usa anon key)
CREATE POLICY "Allow all on usuarios" ON usuarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on familias" ON familias FOR ALL USING (true) WITH CHECK (true);
