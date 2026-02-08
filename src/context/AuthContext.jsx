import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AUTH_STORAGE = 'censo-barrio-auth'
const USERS_STORAGE = 'censo-barrio-users'

function getNombre(rol) {
  return rol === 'admin' ? 'Administradora' : 'Usuario'
}

function restoreLocalAuth(data) {
  if (data.usuario === 'YusleidyCN' || data.usuario === 'MeryCN') {
    return { usuario: data.usuario, rol: 'admin', nombre: 'Administradora' }
  }
  const users = loadLocalUsers()
  const reg = users.find((u) => u.usuario === data.usuario)
  return reg ? { usuario: reg.usuario, rol: reg.rol, nombre: getNombre(reg.rol) } : null
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
          .select('usuario, rol')
          .eq('usuario', data.usuario)
          .single()
          .then(({ data: row, error }) => {
            if (!error && row) {
              setUser({
                usuario: row.usuario,
                rol: row.rol,
                nombre: getNombre(row.rol),
              })
            } else if (error) {
              const auth = restoreLocalAuth(data)
              if (auth) setUser(auth)
            }
          })
      } else {
        const adminMatch = data.usuario === 'YusleidyCN' || data.usuario === 'MeryCN'
        if (adminMatch) {
          setUser({ usuario: data.usuario, rol: 'admin', nombre: 'Administradora' })
          return
        }
        const users = loadLocalUsers()
        const reg = users.find((u) => u.usuario === data.usuario)
        if (reg) {
          setUser({ usuario: reg.usuario, rol: reg.rol, nombre: getNombre(reg.rol) })
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE)
    }
  }, [useDb])

  async function login(usuario, clave) {
    const u = usuario.trim()
    if (useDb && supabase) {
      const { data: row, error } = await supabase
        .from('usuarios')
        .select('usuario, rol')
        .eq('usuario', u)
        .eq('clave', clave)
        .single()
      if (!error && row) {
        const auth = { usuario: row.usuario, rol: row.rol, nombre: getNombre(row.rol) }
        setUser(auth)
        localStorage.setItem(AUTH_STORAGE, JSON.stringify(auth))
        return { ok: true }
      }
    }
    if (u === 'YusleidyCN' && clave === 'CN2026') {
      const auth = { usuario: 'YusleidyCN', rol: 'admin', nombre: 'Administradora' }
      setUser(auth)
      localStorage.setItem(AUTH_STORAGE, JSON.stringify(auth))
      return { ok: true }
    }
    if (u === 'MeryCN' && clave === 'CN2026$') {
      const auth = { usuario: 'MeryCN', rol: 'admin', nombre: 'Administradora' }
      setUser(auth)
      localStorage.setItem(AUTH_STORAGE, JSON.stringify(auth))
      return { ok: true }
    }
    const users = loadLocalUsers()
    const reg = users.find((r) => r.usuario === u && r.clave === clave)
    if (reg) {
      const auth = { usuario: reg.usuario, rol: reg.rol, nombre: getNombre(reg.rol) }
      setUser(auth)
      localStorage.setItem(AUTH_STORAGE, JSON.stringify(auth))
      return { ok: true }
    }
    return { ok: false, error: 'Usuario o contraseña incorrectos' }
  }

  async function register(usuario, clave) {
    const u = usuario.trim()
    if (!u || u.length < 3) return { ok: false, error: 'Usuario debe tener al menos 3 caracteres' }
    if (!clave || clave.length < 4) return { ok: false, error: 'Contraseña debe tener al menos 4 caracteres' }
    if (['yusleidycn', 'merycn'].includes(u.toLowerCase())) {
      return { ok: false, error: 'Ese usuario ya existe' }
    }
    if (useDb && supabase) {
      const { error } = await supabase.from('usuarios').insert({
        usuario: u,
        clave,
        rol: 'jefa',
      })
      if (error) {
        if (error.code === '23505') return { ok: false, error: 'Ese usuario ya está registrado' }
        return { ok: false, error: error.message }
      }
      const auth = { usuario: u, rol: 'jefa', nombre: 'Usuario' }
      setUser(auth)
      localStorage.setItem(AUTH_STORAGE, JSON.stringify(auth))
      return { ok: true }
    }
    const users = loadLocalUsers()
    if (users.some((r) => r.usuario.toLowerCase() === u.toLowerCase())) {
      return { ok: false, error: 'Ese usuario ya está registrado' }
    }
    users.push({ usuario: u, clave, rol: 'jefa' })
    saveLocalUsers(users)
    const auth = { usuario: u, rol: 'jefa', nombre: 'Usuario' }
    setUser(auth)
    localStorage.setItem(AUTH_STORAGE, JSON.stringify(auth))
    return { ok: true }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE)
  }

  const isAdmin = user?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
