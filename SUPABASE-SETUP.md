# Configuración de Supabase

Para usar una base de datos real en lugar de localStorage, sigue estos pasos:

## 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Crea un nuevo proyecto (elige nombre y contraseña de base de datos)
3. Espera a que termine de crear el proyecto

## 2. Ejecutar la migración

1. En el Dashboard de Supabase, ve a **SQL Editor**
2. Clic en **New query**
3. Copia y pega el contenido del archivo `supabase-migration.sql`
4. Ejecuta la consulta (Run)

## 3. Obtener las credenciales

1. Ve a **Project Settings** > **API**
2. Copia:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon public** key (la clave pública)

## 4. Configurar el proyecto

1. Copia `.env.example` y renómbralo a `.env`
2. Edita `.env` y pega tus valores:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

3. Reinicia el servidor de desarrollo (`npm run dev`)

## Usuarios administradoras

La migración crea automáticamente las cuentas:

- **YusleidyCN** / CN2026 (Administradora)
- **MeryCN** / CN2026$ (Administradora)

Los usuarios que se registren obtendrán rol "Usuario" (antes Jefa de calle).
