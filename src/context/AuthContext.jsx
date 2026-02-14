import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AUTH_STORAGE = 'censo-barrio-auth'
const USERS_STORAGE = 'censo-barrio-users'

function getNombre(rol) {
  if (rol === 'admin') return 'Administradora'
  if (rol === 'jefa_calle') return 'Jefa de Calle'
  return 'Usuario'
}

function restoreLocalAuth(data) {
  if (data.usuario === 'YusleidyCN') {
    return { id: 'admin-yusleidy', usuario: data.usuario, rol: 'admin', nombre: 'Administradora' }
  }
  if (data.usuario === 'MeryCN') {
    return { id: 'jefa-mery', usuario: data.usuario, rol: 'jefa_calle', nombre: 'Jefa de Calle' }
  }
  const users = loadLocalUsers()
  const reg = users.find((u) => u.usuario === data.usuario)
  return reg
    ? {
        id: reg.id || `local-${reg.usuario}`,
        usuario: reg.usuario,
        rol: reg.rol,
        jefaCalleId: reg.jefaCalleId,
        nombre: getNombre(reg.rol),
      }
    : null
}

function loadLocalUsers() {
  try {
    const data = localStorage.getItem(USERS_STORAGE)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(USERS_STORAGE, JSON.stringify(users))
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const useDb = isSupabaseConfigured()

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_STORAGE)
    if (!saved) return
    try {
      const data = JSON.parse(saved)
      if (useDb && supabase) {
        supabase
          .from('usuarios')
          .select('id, usuario, rol, jefa_calle_id')
          .eq('usuario', data.usuario)
          .single()
          .then(({ data: row, error }) => {
            if (!error && row) {
              setUser({
                id: row.id,
                usuario: row.usuario,
                rol: row.rol,
                jefaCalleId: row.jefa_calle_id,
                nombre: getNombre(row.rol),
              })
            } else if (error) {
              const auth = restoreLocalAuth(data)
              if (auth) setUser(auth)
            }
          })
      } else {
        if (data.usuario === 'YusleidyCN') {
          setUser({ id: 'admin-yusleidy', usuario: data.usuario, rol: 'admin', nombre: 'Administradora' })
          return
        }
        if (data.usuario === 'MeryCN') {
          setUser({ id: 'jefa-mery', usuario: data.usuario, rol: 'jefa_calle', nombre: 'Jefa de Calle' })
          return
        }
        const users = loadLocalUsers()
        const reg = users.find((u) => u.usuario === data.usuario)
        if (reg) {
          setUser({
            id: reg.id || `local-${reg.usuario}`,
            usuario: reg.usuario,
            rol: reg.rol,
            jefaCalleId: reg.jefaCalleId,
            nombre: getNombre(reg.rol),
          })
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE)
    }
  }, [useDb])

  // Generar código OTP de 6 dígitos
  function generarCodigoOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Enviar código OTP por Email (solo para registro) - GRATIS con Resend
  async function sendOTP(telefono, cedula, datosRegistro, email = null) {
    const tel = telefono.trim()
    const ced = cedula.trim().toUpperCase()

    if (!tel || !ced) {
      return { ok: false, error: 'Teléfono y cédula son requeridos' }
    }

    if (!datosRegistro) {
      return { ok: false, error: 'Datos de registro requeridos' }
    }

    // Validar que la cédula no esté registrada
    if (useDb && supabase) {
      const { data: usuarioExistente } = await supabase
        .from('usuarios')
        .select('cedula')
        .eq('cedula', ced)
        .single()
      if (usuarioExistente) {
        return { ok: false, error: 'Ya existe una cuenta con esta cédula' }
      }
    } else {
      // Modo local: verificar en localStorage
      const users = loadLocalUsers()
      if (users.some((u) => u.cedula === ced)) {
        return { ok: false, error: 'Ya existe una cuenta con esta cédula' }
      }
    }

    const codigo = generarCodigoOTP()

    if (useDb && supabase) {
      // Guardar código en la base de datos
      const { error } = await supabase.from('otp_codes').insert({
        telefono: tel,
        cedula: ced,
        codigo,
        expira_en: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutos
      })

      if (error) {
        return { ok: false, error: 'Error al generar código: ' + error.message }
      }

      // Enviar Email (usar función Edge con Resend - GRATIS)
      try {
        // Necesitamos email para enviar, si no hay email usar teléfono como fallback
        const emailParaEnviar = email || tel
        if (!emailParaEnviar) {
          throw new Error('Email o teléfono requerido')
        }
        await enviarEmail(emailParaEnviar, codigo)
      } catch (err) {
        console.error('Error enviando email:', err)
        // En desarrollo, mostrar el código en consola
        console.log('🔐 CÓDIGO OTP (modo desarrollo - función Edge falló):', codigo)
        console.log('Error:', err.message)
        if (import.meta.env.DEV) {
          alert(`🔐 CÓDIGO OTP (modo desarrollo): ${codigo}\n\nError: ${err.message}\n\nRevisa la consola para más detalles.`)
        }
      }
    } else {
      // Modo local: guardar en localStorage y mostrar código
      const otps = JSON.parse(localStorage.getItem('censo-barrio-otps') || '[]')
      otps.push({
        telefono: tel,
        cedula: ced,
        codigo,
        expira_en: Date.now() + 10 * 60 * 1000,
        datosRegistro, // Guardar datos de usuario/clave
      })
      localStorage.setItem('censo-barrio-otps', JSON.stringify(otps))
      // En desarrollo, mostrar código
      alert(`🔐 CÓDIGO OTP (modo local): ${codigo}`)
    }

    return { ok: true }
  }

  // Función para enviar Email usando Resend (GRATIS - 100 emails/día)
  async function enviarEmail(email, codigo) {
    if (useDb && supabase) {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      // En desarrollo: usar proxy para evitar CORS (vite.config.js)
      const url = import.meta.env.DEV
        ? '/supabase-functions/send-email'
        : `${supabaseUrl}/functions/v1/send-email`

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ email, codigo }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || 'Error en función Edge')
        }
        if (data?.error) throw new Error(data.error)
        return
      } catch (err) {
        console.warn('Función Edge no disponible:', err.message)
        throw err
      }
    }

    throw new Error('Email no configurado - modo desarrollo')
  }

  // Verificar código OTP y crear cuenta (solo para registro)
  async function verifyOTP(telefono, cedula, codigo, datosRegistro) {
    const tel = telefono.trim()
    const ced = cedula.trim().toUpperCase()
    const cod = codigo.trim()

    if (!cod || cod.length !== 6) {
      return { ok: false, error: 'Código inválido' }
    }

    if (!datosRegistro) {
      return { ok: false, error: 'Datos de registro requeridos' }
    }

    if (useDb && supabase) {
      // Buscar código válido en la base de datos
      const { data: otpData, error: otpError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('telefono', tel)
        .eq('cedula', ced)
        .eq('codigo', cod)
        .eq('usado', false)
        .gt('expira_en', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (otpError || !otpData) {
        return { ok: false, error: 'Código inválido o expirado' }
      }

      // Marcar código como usado
      await supabase.from('otp_codes').update({ usado: true }).eq('id', otpData.id)

      // Registrar nuevo usuario con todos los datos
      const { data: nuevoUsuario, error: regError } = await supabase
        .from('usuarios')
        .insert({
          usuario: datosRegistro.usuario,
          clave: datosRegistro.clave,
          telefono: tel,
          cedula: ced,
          rol: 'jefa',
          jefa_calle_id: datosRegistro.jefaCalleId || null,
        })
        .select('id, usuario, rol, jefa_calle_id')
        .single()

      if (regError) {
        if (regError.code === '23505') {
          // Verificar si es por usuario o cédula duplicada
          const { data: usuarioExistente } = await supabase
            .from('usuarios')
            .select('usuario, cedula')
            .or(`usuario.eq.${datosRegistro.usuario},cedula.eq.${ced}`)
            .limit(1)
            .single()
          
          if (usuarioExistente?.usuario === datosRegistro.usuario) {
            return { ok: false, error: 'Ese usuario ya está registrado' }
          }
          if (usuarioExistente?.cedula === ced) {
            return { ok: false, error: 'Ya existe una cuenta con esta cédula' }
          }
        }
        return { ok: false, error: 'Error al crear cuenta: ' + regError.message }
      }

      const auth = {
        id: nuevoUsuario.id,
        usuario: nuevoUsuario.usuario,
        rol: nuevoUsuario.rol,
        jefaCalleId: nuevoUsuario.jefa_calle_id,
        nombre: getNombre(nuevoUsuario.rol),
      }
      setUser(auth)
      localStorage.setItem(AUTH_STORAGE, JSON.stringify(auth))
      return { ok: true }
    } else {
      // Modo local
      const otps = JSON.parse(localStorage.getItem('censo-barrio-otps') || '[]')
      const otpValido = otps.find(
        (o) =>
          o.telefono === tel &&
          o.cedula === ced &&
          o.codigo === cod &&
          o.expira_en > Date.now() &&
          o.datosRegistro
      )

      if (!otpValido) {
        return { ok: false, error: 'Código inválido o expirado' }
      }

      // Eliminar código usado
      const otpsRestantes = otps.filter((o) => o !== otpValido)
      localStorage.setItem('censo-barrio-otps', JSON.stringify(otpsRestantes))

      const users = loadLocalUsers()
      if (users.some((u) => u.usuario === datosRegistro.usuario)) {
        return { ok: false, error: 'Ese usuario ya está registrado' }
      }
      if (users.some((u) => u.cedula === ced)) {
        return { ok: false, error: 'Ya existe una cuenta con esta cédula' }
      }

      const nuevoUsuario = {
        id: `local-${Date.now()}`,
        usuario: datosRegistro.usuario,
        clave: datosRegistro.clave,
        telefono: tel,
        cedula: ced,
        rol: 'jefa',
        jefaCalleId: datosRegistro.jefaCalleId,
      }
      users.push(nuevoUsuario)
      saveLocalUsers(users)
      const auth = {
        id: nuevoUsuario.id,
        usuario: nuevoUsuario.usuario,
        rol: 'jefa',
        jefaCalleId: nuevoUsuario.jefaCalleId,
        nombre: 'Usuario',
      }
      setUser(auth)
      localStorage.setItem(AUTH_STORAGE, JSON.stringify(auth))
      return { ok: true }
    }
  }

  // Login normal con usuario y contraseña
  async function login(usuario, clave) {
    const u = usuario.trim()
    if (useDb && supabase) {
      const { data: row, error } = await supabase
        .from('usuarios')
        .select('id, usuario, rol, jefa_calle_id')
        .eq('usuario', u)
        .eq('clave', clave)
        .single()
      if (!error && row) {
        const auth = {
          id: row.id,
          usuario: row.usuario,
          rol: row.rol,
          jefaCalleId: row.jefa_calle_id,
          nombre: getNombre(row.rol),
        }
        setUser(auth)
        localStorage.setItem(AUTH_STORAGE, JSON.stringify(auth))
        return { ok: true }
      }
    }
    if (u === 'YusleidyCN' && clave === 'CN2026') {
      const auth = { id: 'admin-yusleidy', usuario: 'YusleidyCN', rol: 'admin', nombre: 'Administradora' }
      setUser(auth)
      localStorage.setItem(AUTH_STORAGE, JSON.stringify(auth))
      return { ok: true }
    }
    if (u === 'MeryCN' && clave === 'CN2026$') {
      const auth = { id: 'jefa-mery', usuario: 'MeryCN', rol: 'jefa_calle', nombre: 'Jefa de Calle' }
      setUser(auth)
      localStorage.setItem(AUTH_STORAGE, JSON.stringify(auth))
      return { ok: true }
    }
    const users = loadLocalUsers()
    const reg = users.find((r) => r.usuario === u && r.clave === clave)
    if (reg) {
      const auth = {
        id: reg.id || `local-${reg.usuario}`,
        usuario: reg.usuario,
        rol: reg.rol,
        jefaCalleId: reg.jefaCalleId,
        nombre: getNombre(reg.rol),
      }
      setUser(auth)
      localStorage.setItem(AUTH_STORAGE, JSON.stringify(auth))
      return { ok: true }
    }
    return { ok: false, error: 'Usuario o contraseña incorrectos' }
  }

  // Register ya no se usa directamente, se hace a través de verifyOTP
  async function register(usuario, clave) {
    return { ok: false, error: 'Use el flujo de registro con verificación OTP' }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE)
  }

  const isAdmin = user?.rol === 'admin'
  const isJefaCalle = user?.rol === 'jefa_calle'

  return (
    <AuthContext.Provider value={{ user, login, logout, register, sendOTP, verifyOTP, isAdmin, isJefaCalle }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
