# 🔍 Debug: Email no se envía

## Pasos para Diagnosticar

### 1. Verificar que los Secretos estén configurados

1. Ve a **Supabase Dashboard** → **Project Settings** (⚙️)
2. Ve a **Edge Functions** → **Secrets**
3. Verifica que existan estos dos secretos:
   - ✅ `RESEND_API_KEY` = `re_4dCrDFuK_5SjiPh5gmJ77NYWkqQWESPpo`
   - ✅ `RESEND_FROM_EMAIL` = `onboarding@resend.dev`

**Si no existen, créalos ahora.**

### 2. Verificar que la función esté desplegada

1. Ve a **Edge Functions** en el menú lateral
2. Busca la función `send-email`
3. Verifica que diga **"Active"** o **"Deployed"**
4. Si dice "Not deployed", haz clic en **Deploy**

### 3. Revisar los Logs de la función

1. Ve a **Edge Functions** → `send-email`
2. Haz clic en la pestaña **Logs** o **Invocations**
3. Busca errores recientes
4. Copia cualquier mensaje de error que veas

**Errores comunes:**
- `RESEND_API_KEY is not defined` → Los secretos no están configurados
- `Invalid API key` → La API key está mal copiada
- `Function not found` → La función no está desplegada

### 4. Verificar que el código de la función sea correcto

En el editor de la función `send-email`, verifica que tenga este código (especialmente las primeras líneas):

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@tudominio.com'
```

### 5. Probar la función manualmente

1. En el editor de la función `send-email`
2. Busca el botón **"Test"** o **"Invoke"**
3. Usa este JSON de prueba:
```json
{
  "email": "tu-email@gmail.com",
  "codigo": "123456"
}
```
4. Haz clic en **Run** o **Invoke**
5. Revisa los logs para ver qué pasó

### 6. Verificar en la consola del navegador

1. Abre la app en el navegador
2. Presiona `F12` para abrir las herramientas de desarrollador
3. Ve a la pestaña **Console**
4. Intenta registrar un usuario
5. Busca mensajes de error en rojo
6. Copia cualquier error que veas

---

## Soluciones Comunes

### Error: "Function not found"
- Verifica que la función se llame exactamente `send-email` (con guión, no guión bajo)
- Verifica que esté desplegada

### Error: "RESEND_API_KEY is not defined"
- Los secretos no están configurados
- Ve a **Project Settings** → **Edge Functions** → **Secrets**
- Añade los secretos y vuelve a desplegar la función

### Error: "Invalid API key"
- Verifica que copiaste bien la API key: `re_4dCrDFuK_5SjiPh5gmJ77NYWkqQWESPpo`
- No debe tener espacios al inicio o final

### El código siempre muestra en alert (modo desarrollo)
- La función Edge no se está llamando
- Verifica que la URL de Supabase en `.env` sea correcta
- Verifica que la función esté desplegada

---

## Próximos Pasos

1. Revisa los logs de la función
2. Copia cualquier error que veas
3. Compártelo conmigo para ayudarte a solucionarlo
