# 🔍 Verificar Función Edge

## Pasos para Diagnosticar

### 1. Ver la Consola del Navegador

1. En las herramientas de desarrollador (F12)
2. Haz clic en la pestaña **"Consola"** (no "Novedades")
3. Intenta registrar un usuario de nuevo
4. Busca mensajes de error en rojo
5. Copia cualquier error que veas

### 2. Verificar que la Función esté Desplegada

1. Ve a **Supabase Dashboard** → **Edge Functions**
2. Busca la función `send-email`
3. Verifica que diga **"Active"** o **"Deployed"**
4. Si dice "Not deployed", haz clic en **Deploy**

### 3. Verificar los Secretos

1. Ve a **Project Settings** (⚙️) → **Edge Functions** → **Secrets**
2. Verifica que existan:
   - ✅ `RESEND_API_KEY` = `re_4dCrDFuK_5SjiPh5gmJ77NYWkqQWESPpo`
   - ✅ `RESEND_FROM_EMAIL` = `onboarding@resend.dev`
3. Si no existen, créalos ahora

### 4. Verificar el Código de la Función

1. Ve a **Edge Functions** → `send-email`
2. Verifica que el código tenga estas líneas al inicio:

```typescript
serve(async (req) => {
  // Manejar CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        ...
```

Si NO tiene la parte de CORS, necesitas actualizar el código.

### 5. Probar la Función Manualmente

1. En **Edge Functions** → `send-email`
2. Busca el botón **"Test"** o **"Invoke"**
3. Usa este JSON:
```json
{
  "email": "tu-email@gmail.com",
  "codigo": "123456"
}
```
4. Haz clic en **Run**
5. Revisa qué respuesta da

### 6. Ver los Logs de la Función

1. En **Edge Functions** → `send-email`
2. Haz clic en la pestaña **"Logs"** o **"Invocations"**
3. Busca intentos recientes
4. Copia cualquier error que veas

---

## ⚠️ Posibles Problemas

### Problema 1: La función no tiene CORS
**Solución**: Actualiza el código con el que te di (incluye manejo de OPTIONS)

### Problema 2: Los secretos no están configurados
**Solución**: Añade los secretos en Project Settings → Edge Functions → Secrets

### Problema 3: La función no está desplegada
**Solución**: Haz clic en Deploy en el editor de la función

### Problema 4: El nombre de la función es incorrecto
**Solución**: Debe llamarse exactamente `send-email` (con guión, no guión bajo)

### Problema 5: Error 404 (Not Found) al llamar a la función
**Causa**: La Edge Function **no está desplegada** en Supabase. El proxy está bien configurado, pero la función no existe en el proyecto.
**Solución**: Sigue **CONFIGURAR-RESEND-SIN-CLI.md** para crear y desplegar la función desde el Dashboard de Supabase (sin CLI), o **CONFIGURAR-RESEND-AHORA.md** si usas el CLI.

---

## 📝 Qué Necesito Saber

1. ¿Qué ves en la pestaña **Consola** cuando intentas registrar?
2. ¿Qué dice en los **Logs** de la función `send-email`?
3. ¿La función está **desplegada** (dice "Active")?
4. ¿Los **secretos** están configurados?
