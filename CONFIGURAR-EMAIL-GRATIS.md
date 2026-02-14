# 📧 Configurar Envío de Códigos por Email (100% GRATIS)

## ✅ Opción Recomendada: Resend (100 emails/día GRATIS)

### Paso 1: Crear cuenta en Resend

1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta gratuita (no requiere tarjeta)
3. Verifica tu email
4. Ve a **API Keys** → **Create API Key**
5. Copia la API Key (empieza con `re_...`)

### Paso 2: Verificar dominio (opcional pero recomendado)

**Opción A: Usar dominio personalizado** (recomendado para producción)
- Ve a **Domains** → **Add Domain**
- Sigue las instrucciones para verificar tu dominio
- Usa ese dominio como `RESEND_FROM_EMAIL`

**Opción B: Usar email de prueba** (solo para desarrollo)
- Puedes usar `onboarding@resend.dev` temporalmente
- Solo funciona para emails de prueba

### Paso 3: Crear Edge Function en Supabase

1. **Instala Supabase CLI** (si no lo tienes):
   ```bash
   npm install -g supabase
   ```

2. **Inicia sesión**:
   ```bash
   supabase login
   ```

3. **Vincula tu proyecto**:
   ```bash
   supabase link --project-ref tu-project-ref
   ```
   - El `project-ref` lo encuentras en Supabase Dashboard → Settings → General → Reference ID

4. **Crea la función**:
   ```bash
   supabase functions new send-email
   ```

5. **Copia el código**:
   - Abre `supabase-functions-send-email/index.ts` de tu proyecto
   - Copia TODO el contenido
   - Pégalo en `supabase/functions/send-email/index.ts`

6. **Configura las variables secretas**:
   ```bash
   supabase secrets set RESEND_API_KEY=re_tu_api_key_aqui
   supabase secrets set RESEND_FROM_EMAIL=noreply@tudominio.com
   ```
   - Reemplaza con tu API key de Resend
   - Si no tienes dominio, usa `onboarding@resend.dev` temporalmente

7. **Despliega la función**:
   ```bash
   supabase functions deploy send-email
   ```

### Paso 4: Modificar el código para pedir email

Necesitas modificar el formulario de registro para pedir email además de teléfono. El código ya está preparado para usar email.

---

## 🎯 Alternativas Gratuitas

### Opción 2: SendGrid (100 emails/día gratis)

1. Crea cuenta en [sendgrid.com](https://sendgrid.com)
2. Verifica tu email
3. Crea API Key
4. Usa el código similar pero con endpoint de SendGrid

### Opción 3: EmailJS (200 emails/mes gratis)

1. Crea cuenta en [emailjs.com](https://www.emailjs.com)
2. Configura servicio de email
3. Usa desde el cliente directamente (más simple pero menos seguro)

---

## 💡 Ventajas del Email vs SMS

✅ **Email es GRATIS** (hasta 100/día con Resend)
✅ Más confiable que SMS
✅ No requiere número de teléfono real
✅ Puedes personalizar el diseño
✅ Historial de emails enviados

❌ Requiere que el usuario tenga acceso a su email
❌ Puede ir a spam (pero Resend tiene buena reputación)

---

## 🔧 Solución de Problemas

### Email no llega
- Revisa la carpeta de spam
- Verifica que el dominio esté verificado en Resend
- Revisa los logs: `supabase functions logs send-email`

### Error: "Invalid API key"
- Verifica que copiaste bien la API key
- Asegúrate de que empiece con `re_`

### Error: "Domain not verified"
- Usa `onboarding@resend.dev` para pruebas
- O verifica tu dominio en Resend

---

## ✅ Después de Configurar

Una vez configurado, los usuarios recibirán el código OTP por email en lugar de SMS, y es **100% gratis** hasta 100 emails por día.
