import { useState } from 'react'
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
const labelClass = 'mb-1 block text-sm font-medium text-slate-700'

export function Login({ onLogin, onRegister }) {
  const [modo, setModo] = useState('login') // 'login' | 'register'
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [claveConfirmar, setClaveConfirmar] = useState('')
  const [error, setError] = useState('')
  const [verClave, setVerClave] = useState(false)
  const [verClaveConfirmar, setVerClaveConfirmar] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    const result = await onLogin(usuario.trim(), clave)
    if (!result.ok) {
      setError(result.error || 'Error al iniciar sesión')
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (clave !== claveConfirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    const result = await onRegister(usuario.trim(), clave)
    if (!result.ok) {
      setError(result.error || 'Error al crear cuenta')
    }
  }

  function cambiarModo() {
    setModo((m) => (m === 'login' ? 'register' : 'login'))
    setError('')
    setUsuario('')
    setClave('')
    setClaveConfirmar('')
    setVerClave(false)
    setVerClaveConfirmar(false)
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
        <h1 className="mb-1 text-center text-xl font-semibold text-slate-800">
          Censo Comunal
        </h1>
        <p className="mb-6 text-center text-sm text-slate-600">
          {esRegistro ? 'Crea tu cuenta para continuar' : 'Inicie sesión para continuar'}
        </p>
        <form
          onSubmit={esRegistro ? handleRegister : handleLogin}
          className="space-y-4"
        >
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
              placeholder={esRegistro ? 'Elija un usuario (mín. 3 caracteres)' : 'Ingrese su usuario'}
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
                placeholder={esRegistro ? 'Mín. 4 caracteres' : 'Ingrese su contraseña'}
                required
                minLength={esRegistro ? 4 : undefined}
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
          {esRegistro && (
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
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-900 py-3 font-medium text-white shadow-md shadow-blue-900/20 transition-all hover:bg-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {esRegistro ? 'Crear cuenta' : 'Entrar'}
          </button>
          <p className="text-center text-sm text-slate-600">
            {esRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              type="button"
              onClick={cambiarModo}
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              {esRegistro ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
