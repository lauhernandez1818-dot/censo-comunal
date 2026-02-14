# 📱 Configurar Envío de SMS Reales (Twilio)

## Opción 1: Usar Supabase Edge Function con Twilio (Recomendado)

### Paso 1: Crear cuenta en Twilio

1. Ve a [twilio.com](https://www.twilio.com/try-twilio)
2. Crea una cuenta gratuita (tienes crédito de prueba)
3. Verifica tu número de teléfono
4. Una vez dentro del Dashboard, anota:
   - **Account SID** (está en el Dashboard principal)
   - **Auth Token** (haz clic en "View" para verlo)
   - **Phone Number** (ve a Phone Numbers → Manage → Active numbers, copia el número con formato +584121234567)

### Paso 2: Crear Edge Function en Supabase

1. **Instala Supabase CLI** (si no lo tienes):
   ```bash
   npm install -g supabase
   ```

2. **Inicia sesión en Supabase CLI**:
   ```bash
   supabase login
   ```
   - Te abrirá el navegador para autenticarte

3. **Vincula tu proyecto**:
   ```bash
   supabase link --project-ref tu-project-ref
   ```
   - El `project-ref` lo encuentras en Supabase Dashboard → Settings → General → Reference ID

4. **Crea la función Edge**:
   ```bash
   supabase functions new send-sms
   ```

5. **Copia el código**:
   - Abre el archivo `supabase-functions-send-sms/index.ts` de tu proyecto
   - Copia TODO el contenido
   - Pégalo en `supabase/functions/send-sms/index.ts` (se creó en el paso anterior)

6. **Configura las variables secretas**:
   ```bash
   supabase secrets set TWILIO_ACCOUNT_SID=tu_account_sid
   supabase secrets set TWILIO_AUTH_TOKEN=tu_auth_token
   supabase secrets set TWILIO_FROM_NUMBER=+584121234567
   ```
   - Reemplaza con tus valores reales de Twilio

7. **Despliega la función**:
   ```bash
   supabase functions deploy send-sms
   ```

### Paso 3: Verificar que funciona

1. Prueba registrando un usuario en la app
2. Deberías recibir el SMS en tu teléfono
3. Si no funciona, revisa los logs:
   ```bash
   supabase functions logs send-sms
   ```

---

## Opción 2: Usar Twilio directamente desde el cliente (No recomendado para producción)

⚠️ **ADVERTENCIA**: Esto expone tus credenciales de Twilio en el código del cliente. Solo para pruebas.

### Pasos:

1. **Obtén tus credenciales de Twilio** (igual que en Opción 1)

2. **Crea archivo `.env` en la raíz del proyecto**:
   ```
   VITE_TWILIO_ACCOUNT_SID=tu_account_sid
   VITE_TWILIO_AUTH_TOKEN=tu_auth_token
   VITE_TWILIO_FROM_NUMBER=+584121234567
   ```

3. **Descomenta el código en `AuthContext.jsx`**:
   - Abre `src/context/AuthContext.jsx`
   - Busca la función `enviarSMS`
   - Descomenta las líneas que usan Twilio directamente (líneas ~184-203)

4. **Reinicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

---

## Opción 3: Usar Supabase Auth con SMS (Más simple pero menos control)

Supabase tiene integración nativa con SMS, pero requiere configuración adicional:

1. Ve a Supabase Dashboard → Authentication → Providers
2. Habilita "Phone" provider
3. Configura Twilio allí
4. Tendrías que cambiar el flujo de autenticación para usar Supabase Auth en lugar del sistema custom

**No recomendado** porque tendrías que reescribir mucho código.

---

## 💰 Costos de Twilio

- **Cuenta de prueba**: Gratis, pero solo puedes enviar SMS a números verificados
- **Cuenta real**: ~$0.0075 USD por SMS (muy barato)
- **Crédito inicial**: $15 USD gratis al crear cuenta

---

## 🔧 Solución de Problemas

### Error: "Function not found"
- Verifica que desplegaste la función: `supabase functions deploy send-sms`
- Verifica que el nombre sea exactamente `send-sms`

### Error: "Invalid credentials"
- Verifica que las variables secretas estén bien configuradas
- Verifica que el número tenga formato correcto: `+584121234567` (con + y código de país)

### No recibo SMS
- En cuenta de prueba, solo funciona con números verificados
- Verifica que el número de destino tenga formato correcto
- Revisa los logs: `supabase functions logs send-sms`

### SMS llega pero código no funciona
- Verifica que la tabla `otp_codes` tenga los datos
- Verifica que el código no haya expirado (10 minutos)
- Revisa la consola del navegador para errores

---

## ✅ Recomendación Final

**Usa la Opción 1 (Edge Function)** porque:
- ✅ Más seguro (credenciales en servidor, no en cliente)
- ✅ Ya está implementado
- ✅ Escalable y profesional
- ✅ Fácil de mantener

Si solo quieres probar rápido, usa la Opción 2 pero **NO** lo subas a producción.
