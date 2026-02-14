import { useState, useEffect } from 'react'
import { LogIn, UserPlus, Eye, EyeOff, Smartphone, Shield, Users, Mail } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
const labelClass = 'mb-1 block text-sm font-medium text-slate-700'

export function Login({ onLogin, onRegister, onSendOTP, onVerifyOTP }) {
  const [modo, setModo] = useState('login') // 'login' | 'register'
  const [pasoRegistro, setPasoRegistro] = useState('datos') // 'datos' | 'telefono' | 'codigo'
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [claveConfirmar, setClaveConfirmar] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [cedula, setCedula] = useState('')
  const [codigoOTP, setCodigoOTP] = useState('')
  const [jefaCalleId, setJefaCalleId] = useState('')
  const [jefasCalle, setJefasCalle] = useState([])
  const [error, setError] = useState('')
  const [verClave, setVerClave] = useState(false)
  const [verClaveConfirmar, setVerClaveConfirmar] = useState(false)
  const [enviandoCodigo, setEnviandoCodigo] = useState(false)
  const [datosRegistro, setDatosRegistro] = useState(null) // Guarda usuario/clave mientras se verifica OTP

  // Cargar jefas de calle disponibles
  useEffect(() => {
    async function cargarJefasCalle() {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from('usuarios')
          .select('id, usuario, nombre_display')
          .eq('rol', 'jefa_calle')
          .order('usuario')
        if (!error && data) {
          // Formatear para mostrar nombre_display o usuario como fallback
          const jefasFormateadas = data.map((jefa) => ({
            id: jefa.id,
            usuario: jefa.usuario,
            nombreDisplay: jefa.nombre_display || `Jefa De Calle (${jefa.usuario})`,
          }))
          setJefasCalle(jefasFormateadas)
          // Si solo hay una jefa de calle, seleccionarla por defecto
          if (jefasFormateadas.length === 1) {
            setJefaCalleId(jefasFormateadas[0].id)
          }
        }
      } else {
        // Modo local: usar MeryCN como jefa de calle de ejemplo
        setJefasCalle([{ id: 'local-merycn', usuario: 'MeryCN', nombreDisplay: 'Jefa De Calle 1 (Mery)' }])
        setJefaCalleId('local-merycn')
      }
    }
    if (modo === 'register') {
      cargarJefasCalle()
    }
  }, [modo])

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    const result = await onLogin(usuario.trim(), clave)
    if (!result.ok) {
      setError(result.error || 'Error al iniciar sesión')
    }
  }

  async function handleRegistroDatos(e) {
    e.preventDefault()
    setError('')
    if (clave !== claveConfirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (!jefaCalleId) {
      setError('Debe seleccionar una jefa de calle')
      return
    }
    // Guardar datos y pasar al siguiente paso
    setDatosRegistro({ usuario: usuario.trim(), clave, jefaCalleId })
    setPasoRegistro('telefono')
  }

  async function handleEnviarCodigo(e) {
    e.preventDefault()
    setError('')
    if (!telefono.trim() || !cedula.trim() || !email.trim()) {
      setError('Por favor ingrese teléfono, email y cédula')
      return
    }
    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Ingrese un email válido')
      return
    }
    setEnviandoCodigo(true)
    const result = await onSendOTP(telefono.trim(), cedula.trim(), datosRegistro, email.trim())
    setEnviandoCodigo(false)
    if (result.ok) {
      setPasoRegistro('codigo')
    } else {
      setError(result.error || 'Error al enviar código')
    }
  }

  async function handleVerificarCodigo(e) {
    e.preventDefault()
    setError('')
    if (!codigoOTP.trim() || codigoOTP.length !== 6) {
      setError('Ingrese el código de 6 dígitos')
      return
    }
    const result = await onVerifyOTP(
      telefono.trim(),
      cedula.trim(),
      codigoOTP.trim(),
      datosRegistro
    )
    if (!result.ok) {
      setError(result.error || 'Código incorrecto')
    }
  }

  function cambiarModo() {
    setModo((m) => (m === 'login' ? 'register' : 'login'))
    setPasoRegistro('datos')
    setError('')
    setUsuario('')
    setClave('')
    setClaveConfirmar('')
    setTelefono('')
    setEmail('')
    setCedula('')
    setCodigoOTP('')
    setJefaCalleId('')
    setVerClave(false)
    setVerClaveConfirmar(false)
    setDatosRegistro(null)
  }

  function volverATelefono() {
    setPasoRegistro('telefono')
    setCodigoOTP('')
    setError('')
  }

  function volverADatos() {
    setPasoRegistro('datos')
    setTelefono('')
    setEmail('')
    setCedula('')
    setCodigoOTP('')
    setError('')
  }

  const esRegistro = modo === 'register'

  return (
    <div className="flex min-h-screen min-w-0 items-center justify-center overflow-x-hidden bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-200 px-3 py-6 transition-colors sm:px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-300/30 backdrop-blur-sm sm:p-8">
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-900 text-white shadow-lg shadow-blue-900/30 transition-shadow">
            {esRegistro ? (
              <UserPlus className="h-7 w-7" strokeWidth={2} />
            ) : (
              <LogIn className="h-7 w-7" strokeWidth={2} />
            )}
          </div>
        </div>
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">
            Consejo Comunal
          </h1>
          <p className="mt-1 text-sm font-medium uppercase tracking-wider text-blue-900/90">
            Aqui Esta Oeste
          </p>
        </div>
        <p className="mb-6 text-center text-sm text-slate-600">
          {esRegistro
            ? pasoRegistro === 'codigo'
              ? 'Ingrese el código enviado a su email'
              : pasoRegistro === 'telefono'
                ? 'Ingrese su teléfono, email y cédula para verificar'
                : 'Crea tu cuenta para continuar'
            : 'Inicie sesión para continuar'}
        </p>
        {esRegistro && pasoRegistro === 'datos' ? (
          <form onSubmit={handleRegistroDatos} className="space-y-4">
            <div>
              <label htmlFor="usuario" className={labelClass}>
                Usuario
              </label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className={inputClass}
                placeholder="Elija un usuario (mín. 3 caracteres)"
                required
                minLength={3}
              />
            </div>
            <div>
              <label htmlFor="clave" className={labelClass}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="clave"
                  type={verClave ? 'text' : 'password'}
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  className={`${inputClass} pr-10`}
                  placeholder="Mín. 4 caracteres"
                  required
                  minLength={4}
                />
                <button
                  type="button"
                  onClick={() => setVerClave((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  title={verClave ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {verClave ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="claveConfirmar" className={labelClass}>
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="claveConfirmar"
                  type={verClaveConfirmar ? 'text' : 'password'}
                  value={claveConfirmar}
                  onChange={(e) => setClaveConfirmar(e.target.value)}
                  className={`${inputClass} pr-10`}
                  placeholder="Repita su contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setVerClaveConfirmar((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  title={verClaveConfirmar ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {verClaveConfirmar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="jefaCalle" className={labelClass}>
                Jefa de Calle
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  id="jefaCalle"
                  value={jefaCalleId}
                  onChange={(e) => setJefaCalleId(e.target.value)}
                  className={`${inputClass} pl-10`}
                  required
                >
                  <option value="">Seleccione su jefa de calle</option>
                  {jefasCalle.map((jefa) => (
                    <option key={jefa.id} value={jefa.id}>
                      {jefa.nombreDisplay || jefa.usuario}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-900 py-3 font-medium text-white shadow-md shadow-blue-900/20 transition-all hover:bg-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continuar
            </button>
            <p className="text-center text-sm text-slate-600">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={cambiarModo}
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Iniciar sesión
              </button>
            </p>
          </form>
        ) : esRegistro && pasoRegistro === 'telefono' ? (
          <form onSubmit={handleEnviarCodigo} className="space-y-4">
            <div>
              <label htmlFor="telefono" className={labelClass}>
                Teléfono
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className={`${inputClass} pl-10`}
                  placeholder="04121234567"
                  required
                  pattern="[0-9]{10,11}"
                  title="Ingrese su número de teléfono (10-11 dígitos)"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} pl-10`}
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="cedula" className={labelClass}>
                Cédula
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="cedula"
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className={`${inputClass} pl-10`}
                  placeholder="V12345678"
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={enviandoCodigo}
              className="w-full rounded-lg bg-blue-900 py-3 font-medium text-white shadow-md shadow-blue-900/20 transition-all hover:bg-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enviandoCodigo ? 'Enviando código...' : 'Enviar código'}
            </button>
            <button
              type="button"
              onClick={volverADatos}
              className="w-full text-sm text-slate-600 hover:text-slate-800 underline"
            >
              Volver a datos de usuario
            </button>
          </form>
        ) : esRegistro && pasoRegistro === 'codigo' ? (
          <form onSubmit={handleVerificarCodigo} className="space-y-4">
            <div>
              <label htmlFor="codigoOTP" className={labelClass}>
                Código de verificación
              </label>
              <input
                id="codigoOTP"
                type="text"
                value={codigoOTP}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setCodigoOTP(val)
                }}
                className={`${inputClass} text-center text-2xl tracking-widest font-mono`}
                placeholder="000000"
                required
                maxLength={6}
                autoFocus
              />
              <p className="mt-1 text-xs text-slate-500">
                Código enviado a {email || telefono}
              </p>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-900 py-3 font-medium text-white shadow-md shadow-blue-900/20 transition-all hover:bg-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Verificar y crear cuenta
            </button>
            <button
              type="button"
              onClick={volverATelefono}
              className="w-full text-sm text-slate-600 hover:text-slate-800 underline"
            >
              Cambiar teléfono o cédula
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="usuario" className={labelClass}>
                Usuario
              </label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className={inputClass}
                placeholder="Ingrese su usuario"
                required
              />
            </div>
            <div>
              <label htmlFor="clave" className={labelClass}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="clave"
                  type={verClave ? 'text' : 'password'}
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  className={`${inputClass} pr-10`}
                  placeholder="Ingrese su contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setVerClave((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  title={verClave ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {verClave ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-900 py-3 font-medium text-white shadow-md shadow-blue-900/20 transition-all hover:bg-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Entrar
            </button>
            <p className="text-center text-sm text-slate-600">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={cambiarModo}
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Crear cuenta
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
