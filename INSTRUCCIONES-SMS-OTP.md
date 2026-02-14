# Instrucciones para Autenticación por SMS OTP

## 1. Ejecutar SQL en Supabase

Ejecuta el archivo `supabase-sms-otp-setup.sql` en Supabase > SQL Editor. Esto:
- Añade columnas `telefono` y `cedula` a la tabla `usuarios`
- Crea la tabla `otp_codes` para almacenar códigos temporales
- Configura RLS y triggers

## 2. Actualizar usuarios admin existentes (opcional)

Si tienes usuarios admin (YusleidyCN, MeryCN), actualiza sus teléfonos y cédulas:

```sql
UPDATE public.usuarios 
SET telefono = '04121234567', cedula = 'V12345678' 
WHERE usuario = 'YusleidyCN';

UPDATE public.usuarios 
SET telefono = '04121234568', cedula = 'V12345679' 
WHERE usuario = 'MeryCN';
```

## 3. Configurar envío de SMS (opcional)

### Opción A: Usar Supabase Edge Function con Twilio (recomendado para producción)

1. **Crear función Edge en Supabase:**
   - Ve a Supabase Dashboard > Edge Functions > Create function
   - Nombre: `send-sms`
   - Copia el contenido de `supabase-functions-send-sms/index.ts`

2. **Configurar variables de entorno en Supabase:**
   - Ve a Project Settings > Edge Functions > Secrets
   - Añade:
     - `TWILIO_ACCOUNT_SID`: Tu Account SID de Twilio
     - `TWILIO_AUTH_TOKEN`: Tu Auth Token de Twilio
     - `TWILIO_FROM_NUMBER`: Tu número de Twilio (formato: +584121234567)

3. **Desplegar la función:**
   ```bash
   supabase functions deploy send-sms
   ```

### Opción B: Usar Twilio directamente desde el cliente (no recomendado para producción)

Si prefieres usar Twilio directamente, descomenta el código en `AuthContext.jsx` (función `enviarSMS`) y añade a tu `.env`:

```
VITE_TWILIO_ACCOUNT_SID=tu_account_sid
VITE_TWILIO_AUTH_TOKEN=tu_auth_token
VITE_TWILIO_FROM_NUMBER=+584121234567
```

**⚠️ ADVERTENCIA:** Esto expone tus credenciales de Twilio en el cliente. Solo para desarrollo.

### Opción C: Modo desarrollo (sin SMS real)

Si no configuras Twilio, la app funcionará en modo desarrollo:
- Los códigos OTP se mostrarán en consola/alert
- Los códigos se guardan en la base de datos y funcionan normalmente
- Útil para pruebas locales

## 4. Probar el sistema

1. **Iniciar sesión:**
   - Ingresa teléfono y cédula
   - Se enviará un código OTP (o se mostrará en desarrollo)
   - Ingresa el código de 6 dígitos
   - Si el código es correcto, inicias sesión

2. **Registrarse:**
   - Ingresa teléfono y cédula (que no estén registrados)
   - Se enviará un código OTP
   - Ingresa el código
   - Se creará automáticamente una cuenta con usuario `user_<cedula>`

## 5. Ventajas del sistema

- ✅ **Evita multicuentas:** Una cédula = una cuenta
- ✅ **Más seguro:** No hay contraseñas que puedan filtrarse
- ✅ **Verificación real:** El teléfono debe ser válido para recibir el código
- ✅ **Códigos temporales:** Los códigos expiran en 10 minutos y solo se pueden usar una vez

## Notas

- Los códigos OTP tienen una validez de 10 minutos
- Cada código solo se puede usar una vez
- Los códigos expirados se limpian automáticamente
- En desarrollo, los códigos se muestran en consola/alert para facilitar pruebas
