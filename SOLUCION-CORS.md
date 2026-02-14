# 🔧 Solución: Error CORS en Edge Function

## Problema Detectado

El error es: **"CORS policy: Response to preflight request doesn't pass access control check"**

Esto significa que la función Edge no está permitiendo peticiones desde localhost.

## Solución: Actualizar la Función Edge

### Paso 1: Actualizar el código de la función

1. Ve a **Supabase Dashboard** → **Edge Functions** → `send-email`
2. **Reemplaza TODO el código** con este (ya incluye CORS):

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@tudominio.com'

serve(async (req) => {
  // Manejar CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  try {
    const { telefono, codigo, email } = await req.json()

    if (!codigo) {
      return new Response(
        JSON.stringify({ error: 'Código es requerido' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      )
    }

    // Si Resend no está configurado, devolver éxito pero no enviar email real
    if (!RESEND_API_KEY || !email) {
      console.log(`[DEV] Email no enviado - Código OTP: ${codigo} para ${email || telefono}`)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email no configurado (modo desarrollo)',
          codigo
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      )
    }

    // Enviar Email con Resend
    const resendUrl = 'https://api.resend.com/emails'
    
    const emailData = {
      from: `Consejo Comunal <${RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: 'Código de Verificación - Consejo Comunal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Código de Verificación</h2>
          <p>Tu código de verificación es:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px;">
            ${codigo}
          </div>
          <p style="color: #6b7280; font-size: 14px;">Este código es válido por 10 minutos.</p>
          <p style="color: #6b7280; font-size: 14px;">Si no solicitaste este código, ignora este mensaje.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px;">Consejo Comunal Aquí Está Oeste</p>
        </div>
      `,
    }

    const response = await fetch(resendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Resend error: ${errorText}`)
    }

    const result = await response.json()
    
    return new Response(
      JSON.stringify({ success: true, message: 'Email enviado correctamente' }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )
  } catch (error) {
    console.error('Error enviando email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )
  }
})
```

### Paso 2: Desplegar de nuevo

1. Haz clic en **Deploy** (botón verde)
2. Espera a que diga "Deployed successfully"

### Paso 3: Probar de nuevo

1. Intenta registrar un usuario con email
2. Ahora debería funcionar sin error CORS
3. Revisa tu Gmail (y spam)

---

## ✅ Cambios Realizados

- ✅ Añadido manejo de peticiones OPTIONS (preflight CORS)
- ✅ Añadido header `Access-Control-Allow-Origin: *` en todas las respuestas
- ✅ Añadido headers CORS necesarios

---

## 🔍 Si Aún No Funciona

1. Verifica que los secretos estén configurados:
   - `RESEND_API_KEY` = `re_4dCrDFuK_5SjiPh5gmJ77NYWkqQWESPpo`
   - `RESEND_FROM_EMAIL` = `onboarding@resend.dev`

2. Revisa los logs de la función en Supabase Dashboard

3. Verifica que el email que ingresas sea válido
