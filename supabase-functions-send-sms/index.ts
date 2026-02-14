// Supabase Edge Function para enviar SMS
// Despliega esto en Supabase > Edge Functions > Create function > "send-sms"
// Requiere configuración de Twilio en las variables de entorno de Supabase

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_FROM_NUMBER = Deno.env.get('TWILIO_FROM_NUMBER')

serve(async (req) => {
  try {
    const { telefono, codigo } = await req.json()

    if (!telefono || !codigo) {
      return new Response(
        JSON.stringify({ error: 'Teléfono y código son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Si Twilio no está configurado, devolver éxito pero no enviar SMS real
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
      console.log(`[DEV] SMS no enviado - Código OTP: ${codigo} para ${telefono}`)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'SMS no configurado (modo desarrollo)',
          codigo // Solo en desarrollo
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Enviar SMS con Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
    
    const formData = new URLSearchParams({
      From: TWILIO_FROM_NUMBER,
      To: telefono,
      Body: `Tu código de verificación es: ${codigo}. Válido por 10 minutos. - Consejo Comunal Aquí Está Oeste`,
    })

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Twilio error: ${errorText}`)
    }

    const result = await response.json()
    
    return new Response(
      JSON.stringify({ success: true, message: 'SMS enviado correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error enviando SMS:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
