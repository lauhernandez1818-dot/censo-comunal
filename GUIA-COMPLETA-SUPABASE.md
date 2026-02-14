# Guía Completa: Configuración en Supabase

## 📋 Pasos a Seguir (en orden)

### Paso 1: Arreglar tabla `censo_familias` (añadir columnas faltantes)

1. Ve a **Supabase Dashboard** → Tu proyecto → **SQL Editor** (icono de terminal en el menú lateral)
2. Haz clic en **New query** (botón verde arriba a la derecha)
3. Abre el archivo `supabase-arreglar-censo-familias-columnas.sql` desde tu proyecto
4. **Copia TODO el contenido** del archivo
5. **Pega** en el editor SQL de Supabase
6. Haz clic en **Run** (botón verde) o presiona `Ctrl + Enter`
7. ✅ Deberías ver "Success. No rows returned" o similar

**¿Qué hace esto?**
- Añade todas las columnas que faltan en `censo_familias` (nro_ninos, nro_adultos, estado_vivienda, etc.)
- Configura RLS (Row Level Security) correctamente
- **NO borra datos existentes**, solo añade columnas

---

### Paso 2: Configurar SMS OTP (teléfono, cédula, códigos)

1. En el mismo **SQL Editor**, haz clic en **New query** otra vez
2. Abre el archivo `supabase-sms-otp-setup.sql` desde tu proyecto
3. **Copia TODO el contenido** del archivo
4. **Pega** en el editor SQL de Supabase
5. Haz clic en **Run** o presiona `Ctrl + Enter`
6. ✅ Deberías ver "Success. No rows returned" o similar

**¿Qué hace esto?**
- Añade columnas `telefono` y `cedula` a la tabla `usuarios`
- Crea la tabla `otp_codes` para almacenar códigos temporales
- Configura limpieza automática de códigos expirados
- Configura RLS para que la app pueda leer y escribir

---

### Paso 3: Configurar Jefas de Calle

1. En el mismo **SQL Editor**, haz clic en **New query** otra vez
2. Abre el archivo `supabase-jefas-calle-setup.sql` desde tu proyecto
3. **Copia TODO el contenido** del archivo
4. **Pega** en el editor SQL de Supabase
5. Haz clic en **Run** o presiona `Ctrl + Enter`
6. ✅ Deberías ver "Success. No rows returned" o similar

**¿Qué hace esto?**
- Añade campo `jefa_calle_id` a `usuarios` (para usuarios normales)
- Añade campo `nombre_display` a `usuarios` (para mostrar nombres descriptivos)
- Cambia MeryCN de `admin` a `jefa_calle`
- Establece `nombre_display = 'Jefa De Calle 1 (Mery)'` para MeryCN
- Añade campo `jefa_calle_id` a `censo_familias` (para filtrar por comunidad)
- Crea índices para búsquedas rápidas

---

### Paso 4: Verificar que todo esté correcto

#### Verificar tabla `usuarios`:
1. Ve a **Table Editor** (icono de tabla en el menú lateral)
2. Selecciona la tabla `usuarios`
3. Verifica que veas estas columnas:
   - ✅ `id`
   - ✅ `usuario`
   - ✅ `clave`
   - ✅ `rol`
   - ✅ `telefono` (nueva)
   - ✅ `cedula` (nueva)
   - ✅ `jefa_calle_id` (nueva)
   - ✅ `nombre_display` (nueva)
   - ✅ `created_at`

4. Verifica que MeryCN tenga:
   - `rol` = `jefa_calle` (no `admin`)
   - `nombre_display` = `Jefa De Calle 1 (Mery)`

#### Verificar tabla `censo_familias`:
1. En **Table Editor**, selecciona la tabla `censo_familias`
2. Verifica que veas estas columnas:
   - ✅ `id`
   - ✅ `jefe_familia`
   - ✅ `cedula`
   - ✅ `nro_integrantes`
   - ✅ `nro_ninos` (nueva)
   - ✅ `nro_adultos` (nueva)
   - ✅ `nro_adultos_mayores` (nueva)
   - ✅ `discapacidad` (nueva)
   - ✅ `discapacidad_condicion` (nueva)
   - ✅ `discapacidad_condicion_detalle` (nueva)
   - ✅ `salud_observacion` (nueva)
   - ✅ `estado_vivienda` (nueva)
   - ✅ `nudo_critico` (nueva)
   - ✅ `usuario_creador` (nueva)
   - ✅ `jefa_calle_id` (nueva)
   - ✅ `created_at`

#### Verificar tabla `otp_codes`:
1. En **Table Editor**, busca la tabla `otp_codes`
2. Debería existir con estas columnas:
   - ✅ `id`
   - ✅ `telefono`
   - ✅ `cedula`
   - ✅ `codigo`
   - ✅ `usado`
   - ✅ `expira_en`
   - ✅ `created_at`

---

### Paso 5: Actualizar usuarios admin existentes (opcional)

Si quieres añadir teléfono y cédula a YusleidyCN y MeryCN:

1. En **SQL Editor**, crea una nueva query
2. Ejecuta esto (cambia los valores por los reales):

```sql
-- Actualizar YusleidyCN (admin)
UPDATE public.usuarios 
SET telefono = '04121234567', cedula = 'V12345678' 
WHERE usuario = 'YusleidyCN';

-- Actualizar MeryCN (jefa de calle)
UPDATE public.usuarios 
SET telefono = '04121234568', cedula = 'V12345679' 
WHERE usuario = 'MeryCN';
```

3. Haz clic en **Run**

---

### Paso 6: Verificar RLS (Row Level Security)

1. Ve a **Authentication** → **Policies** en el menú lateral
2. O ve a **Table Editor** → selecciona una tabla → pestaña **Policies**
3. Verifica que las tablas tengan políticas:
   - `usuarios`: debería tener "Allow usuarios" o "Allow all on usuarios"
   - `censo_familias`: debería tener "Allow all on censo_familias"
   - `otp_codes`: debería tener "Allow all on otp_codes"

Si alguna tabla no tiene políticas, las queries anteriores las crearon automáticamente.

---

## ✅ Checklist Final

Antes de probar en localhost, verifica:

- [ ] Tabla `usuarios` tiene todas las columnas nuevas
- [ ] MeryCN tiene `rol = 'jefa_calle'` y `nombre_display = 'Jefa De Calle 1 (Mery)'`
- [ ] Tabla `censo_familias` tiene todas las columnas nuevas
- [ ] Tabla `otp_codes` existe y tiene todas las columnas
- [ ] Todas las tablas tienen RLS habilitado y políticas configuradas

---

## 🚨 Si algo sale mal

### Error: "column already exists"
- ✅ **No pasa nada**, significa que la columna ya existe
- Puedes continuar con el siguiente paso

### Error: "relation does not exist"
- Verifica que estés en el proyecto correcto de Supabase
- Verifica que el esquema sea `public` (por defecto)

### Error: "permission denied"
- Verifica que estés usando el rol `postgres` (debería ser el predeterminado en SQL Editor)
- Si usas otro rol, cambia a `postgres` en el dropdown del SQL Editor

### Los datos no se guardan en Supabase
- Verifica que las variables de entorno `.env` tengan:
  ```
  VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
  VITE_SUPABASE_ANON_KEY=tu-anon-key
  ```
- Verifica que las políticas RLS permitan INSERT/UPDATE/DELETE

---

## 📝 Notas Importantes

1. **Orden de ejecución**: Ejecuta los SQL en el orden indicado (1, 2, 3)
2. **No borra datos**: Todos los scripts usan `ADD COLUMN IF NOT EXISTS`, así que no borran datos existentes
3. **Backup**: Si tienes datos importantes, haz un backup antes (Supabase → Database → Backups)
4. **Modo desarrollo**: Si no configuras SMS (Twilio), los códigos OTP se mostrarán en alert/consola en desarrollo

---

## 🎉 ¡Listo!

Después de completar estos pasos, tu base de datos estará completamente configurada. Puedes probar la app en localhost y todo debería funcionar correctamente.

Si tienes dudas o errores, revisa la sección "Si algo sale mal" arriba.
