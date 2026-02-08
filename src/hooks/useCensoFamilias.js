import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const STORAGE_KEY = 'censo-familias-local'

function toApp(row) {
  if (!row) return null
  return {
    id: row.id,
    usuarioCreador: row.usuario_creador ?? row.usuarioCreador ?? null,
    jefeFamilia: row.jefe_familia ?? row.jefeFamilia,
    cedula: row.cedula,
    nroIntegrantes: row.nro_integrantes ?? row.nroIntegrantes ?? 0,
    nroNinos: row.nro_ninos ?? row.nroNinos ?? 0,
    nroAdultos: row.nro_adultos ?? row.nroAdultos ?? 0,
    nroAdultosMayores: row.nro_adultos_mayores ?? row.nroAdultosMayores ?? 0,
    discapacidad: row.discapacidad ?? false,
    discapacidadCondicion: row.discapacidad_condicion ?? row.discapacidadCondicion ?? (row.discapacidad ? 'discapacidad' : 'ninguna'),
    discapacidadCondicionDetalle: row.discapacidad_condicion_detalle ?? row.discapacidadCondicionDetalle ?? '',
    saludObservacion: row.salud_observacion ?? row.saludObservacion ?? '',
    estadoVivienda: row.estado_vivienda ?? row.estadoVivienda ?? 'Bueno',
    nudoCritico: row.nudo_critico ?? row.nudoCritico ?? '',
  }
}

function toDb(f, usuarioCreador = null) {
  const out = {
    jefe_familia: f.jefeFamilia,
    cedula: f.cedula,
    nro_integrantes: f.nroIntegrantes ?? 0,
    nro_ninos: f.nroNinos ?? 0,
    nro_adultos: f.nroAdultos ?? 0,
    nro_adultos_mayores: f.nroAdultosMayores ?? 0,
    discapacidad: f.discapacidad ?? false,
    discapacidad_condicion: f.discapacidadCondicion ?? (f.discapacidad ? 'discapacidad' : 'ninguna'),
    discapacidad_condicion_detalle: f.discapacidadCondicionDetalle || null,
    salud_observacion: f.saludObservacion || null,
    estado_vivienda: f.estadoVivienda ?? 'Bueno',
    nudo_critico: f.nudoCritico || null,
  }
  if (usuarioCreador != null) out.usuario_creador = usuarioCreador
  return out
}

function loadLocal() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveLocal(familias) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(familias))
}

export function useCensoFamilias() {
  const [familias, setFamilias] = useState([])
  const [loading, setLoading] = useState(true)
  const [useSupabase, setUseSupabase] = useState(true)

  const fetchFamilias = useCallback(async () => {
    if (!supabase) {
      setUseSupabase(false)
      const local = loadLocal()
      return local.map((row) => toApp({ ...row, jefe_familia: row.jefeFamilia, nro_integrantes: row.nroIntegrantes }))
    }
    const { data, error } = await supabase
      .from('censo_familias')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.warn('Supabase no disponible, usando localStorage:', error.message)
      setUseSupabase(false)
      const local = loadLocal()
      return local.map((r) => toApp({ ...r, jefe_familia: r.jefeFamilia, nro_integrantes: r.nroIntegrantes }))
    }
    return (data || []).map(toApp)
  }, [])

  useEffect(() => {
    fetchFamilias().then((data) => {
      setFamilias(data)
      setLoading(false)
    })
  }, [fetchFamilias])

  useEffect(() => {
    if (!useSupabase || !supabase) return
    const channel = supabase
      .channel('censo_familias_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'censo_familias' },
        () => fetchFamilias().then(setFamilias)
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [useSupabase, fetchFamilias])

  const addFamilia = useCallback(async (familia, usuarioCreador = null) => {
    const payload = toDb(familia, usuarioCreador)
    const id = crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const nueva = { ...familia, id, usuarioCreador }

    if (useSupabase && supabase) {
      const { data, error } = await supabase
        .from('censo_familias')
        .insert(payload)
        .select('id')
        .single()
      if (!error && data) {
        setFamilias((prev) => [toApp({ ...familia, id: data.id, usuario_creador: usuarioCreador }), ...prev])
        return data.id
      }
      console.warn('Error Supabase, guardando en localStorage:', error?.message)
      setUseSupabase(false)
    }

    const lista = [nueva, ...familias]
    setFamilias(lista)
    saveLocal(lista)
    return id
  }, [useSupabase, familias])

  const updateFamilia = useCallback(async (id, familia) => {
    const payload = toDb(familia)
    if (payload.usuario_creador !== undefined) delete payload.usuario_creador
    if (useSupabase && supabase) {
      const { error } = await supabase.from('censo_familias').update(payload).eq('id', id)
      if (!error) {
        const original = familias.find((f) => f.id === id)
        setFamilias((prev) =>
          prev.map((f) =>
            f.id === id ? toApp({ ...familia, id, usuario_creador: original?.usuarioCreador }) : f
          )
        )
        const lista = familias.map((f) =>
          f.id === id ? { ...f, ...familia, id, usuarioCreador: original?.usuarioCreador } : f
        )
        saveLocal(lista)
        return true
      }
      console.warn('Error al actualizar en Supabase:', error?.message)
    }
    const original = familias.find((f) => f.id === id)
    const lista = familias.map((f) =>
      f.id === id ? { ...familia, id, usuarioCreador: original?.usuarioCreador } : f
    )
    setFamilias(lista)
    saveLocal(lista)
    return true
  }, [useSupabase, familias])

  const deleteFamilia = useCallback(async (id) => {
    const lista = familias.filter((f) => f.id !== id)
    if (useSupabase && supabase) {
      const { error } = await supabase.from('censo_familias').delete().eq('id', id)
      if (!error) {
        setFamilias(lista)
        saveLocal(lista)
        return
      }
      console.warn('Error al borrar en Supabase:', error?.message)
    }
    setFamilias(lista)
    saveLocal(lista)
  }, [useSupabase, familias])

  return { familias, loading, addFamilia, updateFamilia, deleteFamilia, fetchFamilias, useSupabase }
}
