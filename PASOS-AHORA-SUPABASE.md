# Pasos a Ejecutar AHORA en Supabase

## 📌 Situación Actual

Tienes estas 3 queries guardadas en Supabase (son antiguas, ya ejecutadas):
- ✅ "Usuarios and Censo Familias s..." (ya ejecutada)
- ✅ "Censo_Familias" (ya ejecutada)
- ✅ "crear usario" (ya ejecutada)

## 🎯 Lo que Necesitas Hacer AHORA

Ejecuta estos **3 scripts nuevos** en orden (uno por uno):

---

### ✅ Paso 1: Arreglar censo_familias (añadir columnas faltantes)

1. En Supabase → **SQL Editor** → Haz clic en **New query** (botón verde arriba)
2. Abre el archivo `supabase-arreglar-censo-familias-columnas.sql` desde tu proyecto
3. **Copia TODO** el contenido
4. **Pega** en el editor SQL de Supabase
5. Haz clic en **Run** (o `Ctrl + Enter`)
6. ✅ Deberías ver "Success"

**Archivo:** `supabase-arreglar-censo-familias-columnas.sql`

---

### ✅ Paso 2: Configurar SMS OTP (teléfono, cédula, códigos)

1. En **SQL Editor** → **New query** otra vez
2. Abre el archivo `supabase-sms-otp-setup.sql`
3. **Copia TODO** el contenido
4. **Pega** en el editor SQL
5. Haz clic en **Run**
6. ✅ Deberías ver "Success"

**Archivo:** `supabase-sms-otp-setup.sql`

---

### ✅ Paso 3: Configurar Jefas de Calle

1. En **SQL Editor** → **New query** otra vez
2. Abre el archivo `supabase-jefas-calle-setup.sql`
3. **Copia TODO** el contenido
4. **Pega** en el editor SQL
5. Haz clic en **Run**
6. ✅ Deberías ver "Success"

**Archivo:** `supabase-jefas-calle-setup.sql`

---

## 🔍 Verificar que Funcionó

Después de ejecutar los 3 scripts:

1. Ve a **Table Editor** → tabla `usuarios`
   - Debe tener columnas: `telefono`, `cedula`, `jefa_calle_id`, `nombre_display`
   - MeryCN debe tener `rol = 'jefa_calle'` y `nombre_display = 'Jefa De Calle 1 (Mery)'`

2. Ve a **Table Editor** → tabla `censo_familias`
   - Debe tener todas las columnas nuevas (nro_ninos, estado_vivienda, jefa_calle_id, etc.)

3. Ve a **Table Editor** → busca tabla `otp_codes`
   - Debe existir con columnas: telefono, cedula, codigo, usado, expira_en

---

## ⚠️ Nota Importante

**NO necesitas ejecutar las queries antiguas otra vez.** Esas ya están ejecutadas y crearon las tablas básicas. Los 3 scripts nuevos solo añaden columnas y configuraciones adicionales.

---

## 🎉 Listo

Después de ejecutar estos 3 scripts, tu base de datos estará completamente actualizada con:
- ✅ Todas las columnas necesarias en censo_familias
- ✅ Sistema de SMS OTP configurado
- ✅ Sistema de jefas de calle configurado

¡Ya puedes probar la app en localhost!
