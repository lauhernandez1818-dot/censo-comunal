# 🚀 Configurar Resend AHORA

## Tu API Key de Resend
`re_4dCrDFuK_5SjiPh5gmJ77NYWkqQWESPpo`

## Pasos para Configurar

### 1. Instalar Supabase CLI (si no lo tienes)

Abre PowerShell o Terminal y ejecuta:

```bash
npm install -g supabase
```

### 2. Iniciar sesión en Supabase

```bash
supabase login
```

Te abrirá el navegador para autenticarte.

### 3. Vincular tu proyecto

```bash
supabase link --project-ref tu-project-ref
```

**¿Dónde encuentro el project-ref?**
- Ve a Supabase Dashboard
- Settings → General
- Busca "Reference ID" (es algo como `bncwnyqjhtpsuhvqofmw`)

### 4. Crear la función Edge

```bash
supabase functions new send-email
```

### 5. Copiar el código

1. Abre el archivo `supabase-functions-send-email/index.ts` de tu proyecto
2. Copia TODO el contenido
3. Pégalo en `supabase/functions/send-email/index.ts` (se creó en el paso anterior)

### 6. Configurar los secretos

Ejecuta estos comandos (reemplaza `tu-project-ref` con el tuyo):

```bash
supabase secrets set RESEND_API_KEY=re_4dCrDFuK_5SjiPh5gmJ77NYWkqQWESPpo
supabase secrets set RESEND_FROM_EMAIL=onboarding@resend.dev
```

### 7. Desplegar la función

```bash
supabase functions deploy send-email
```

### 8. Verificar que funciona

1. Prueba registrando un usuario en la app
2. Deberías recibir el código por email
3. Si hay errores, revisa los logs:
   ```bash
   supabase functions logs send-email
   ```

---

## ⚠️ Importante

- **Mantén tu API key segura** - No la compartas públicamente
- **Usa `onboarding@resend.dev`** solo para pruebas
- **Para producción**, verifica tu dominio en Resend y usa ese email

---

## ✅ Listo

Una vez completados estos pasos, los usuarios recibirán códigos OTP por email de forma **100% GRATIS** (hasta 100 emails/día).
