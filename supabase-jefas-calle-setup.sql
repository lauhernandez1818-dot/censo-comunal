-- Ejecuta esto en Supabase > SQL Editor
-- Configura el sistema de jefas de calle

-- 1. Añadir campo jefa_calle_id a usuarios (para usuarios normales que pertenecen a una jefa de calle)
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS jefa_calle_id UUID REFERENCES public.usuarios(id);

-- 2. Añadir campo nombre_display para mostrar nombres descriptivos de jefas de calle
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS nombre_display TEXT;

-- 3. Cambiar MeryCN de admin a jefa_calle y añadir nombre display
UPDATE public.usuarios 
SET rol = 'jefa_calle',
    nombre_display = 'Jefa De Calle 1 (Mery)'
WHERE usuario = 'MeryCN';

-- 4. Añadir campo jefa_calle_id a censo_familias (para poder filtrar por comunidad)
ALTER TABLE public.censo_familias ADD COLUMN IF NOT EXISTS jefa_calle_id UUID REFERENCES public.usuarios(id);

-- 5. Crear índice para búsquedas rápidas por jefa de calle
CREATE INDEX IF NOT EXISTS idx_usuarios_jefa_calle ON public.usuarios(jefa_calle_id);
CREATE INDEX IF NOT EXISTS idx_censo_jefa_calle ON public.censo_familias(jefa_calle_id);

-- 6. Función para obtener el jefa_calle_id de un usuario
-- Si el usuario es jefa_calle, su jefa_calle_id es su propio id
-- Si es usuario normal, usa su jefa_calle_id asignado
CREATE OR REPLACE FUNCTION obtener_jefa_calle_id(p_usuario_id UUID)
RETURNS UUID AS $$
DECLARE
  v_rol TEXT;
  v_jefa_calle_id UUID;
BEGIN
  SELECT rol, jefa_calle_id INTO v_rol, v_jefa_calle_id
  FROM public.usuarios
  WHERE id = p_usuario_id;
  
  IF v_rol = 'jefa_calle' THEN
    RETURN p_usuario_id; -- La jefa de calle ve su propia comunidad
  ELSIF v_jefa_calle_id IS NOT NULL THEN
    RETURN v_jefa_calle_id; -- Usuario normal ve según su jefa asignada
  ELSE
    RETURN NULL; -- Sin jefa asignada
  END IF;
END;
$$ LANGUAGE plpgsql;
