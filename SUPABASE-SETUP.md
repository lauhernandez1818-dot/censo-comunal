# Configuración de Supabase (para que todos vean los mismos datos)

Si ves el aviso **"Usando almacenamiento local"**, los datos solo se guardan en cada dispositivo. Para que tú, tu novia y todos los usuarios vean las mismas familias, debes configurar Supabase.

---

## 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Crea un nuevo proyecto (elige nombre y contraseña de base de datos)
3. Espera a que termine de crear el proyecto

## 2. Ejecutar el SQL en Supabase

En el Dashboard de Supabase → **SQL Editor** → **New query**, ejecuta en este orden:

### Paso A: Crear tabla de usuarios
Copia y ejecuta el contenido de `supabase-crear-usuarios.sql`

### Paso B: Crear tabla de censo
Copia y ejecuta el contenido de `supabase-crear-censo-familias.sql`

### Paso C: Si la tabla ya existía con otro esquema
Copia y ejecuta el contenido de `supabase-corregir-censo-familias.sql`

## 3. Obtener las credenciales

1. En Supabase: **Project Settings** (engranaje) → **API**
2. Copia:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon public** key (la clave pública, no la service_role)

## 4. Configurar en Vercel (para producción)

1. Ve a [vercel.com](https://vercel.com) → tu proyecto → **Settings** → **Environment Variables**
2. Añade estas variables (para Production, Preview y Development):

| Nombre | Valor |
|--------|-------|
| `VITE_SUPABASE_URL` | Tu Project URL (ej: https://xxx.supabase.co) |
| `VITE_SUPABASE_ANON_KEY` | Tu anon public key |

3. Haz un **nuevo despliegue** (Redeploy) para que las variables se apliquen

## 5. Para desarrollo local

1. Crea un archivo `.env` en la raíz del proyecto
2. Añade:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

3. Reinicia `npm run dev`

---

## Usuarios administradoras

- **YusleidyCN** / CN2026
- **MeryCN** / CN2026$

Los usuarios que se registren podrán crear una familia cada uno.
