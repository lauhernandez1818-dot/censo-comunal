# 📧 Configurar Resend SIN CLI (Usando Dashboard)

## Método más fácil: Usar el Dashboard de Supabase

### Paso 1: Crear Edge Function desde el Dashboard

1. Ve a tu **Supabase Dashboard**
2. En el menú lateral, busca **Edge Functions** (icono de rayo ⚡)
3. Haz clic en **Create a new function**
4. Nombre: `send-email`
5. Haz clic en **Create function**

### Paso 2: Copiar el código

1. Abre el archivo `supabase-functions-send-email/index.ts` de tu proyecto
2. **Copia TODO el contenido**
3. En el Dashboard de Supabase, en el editor de código de la función `send-email`
4. **Borra** el código de ejemplo que viene por defecto
5. **Pega** el código que copiaste

### Paso 3: Configurar las variables secretas

1. En el Dashboard, ve a **Project Settings** (icono de engranaje ⚙️)
2. Ve a **Edge Functions** → **Secrets**
3. Haz clic en **Add new secret**
4. Añade estos dos secretos:

   **Secret 1:**
   - Name: `RESEND_API_KEY`
   - Value: `re_4dCrDFuK_5SjiPh5gmJ77NYWkqQWESPpo`
   - Haz clic en **Save**

   **Secret 2:**
   - Name: `RESEND_FROM_EMAIL`
   - Value: `onboarding@resend.dev`
   - Haz clic en **Save**

### Paso 4: Desplegar la función

1. En el editor de la función `send-email`
2. Haz clic en **Deploy** (botón verde arriba a la derecha)
3. Espera a que diga "Deployed successfully"

### Paso 5: Probar

1. Prueba registrando un usuario en la app con un email válido
2. Deberías recibir el código por email
3. Si hay errores, ve a **Edge Functions** → **Logs** para ver qué pasó

---

## ✅ Listo

¡Ya está configurado! Los usuarios recibirán códigos OTP por email de forma **100% GRATIS**.

---

## 🔍 Verificar que funciona

Si quieres ver los logs de la función:
1. Ve a **Edge Functions** → `send-email`
2. Haz clic en la pestaña **Logs**
3. Verás todos los intentos de envío y errores si los hay
