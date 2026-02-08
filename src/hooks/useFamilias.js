import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const STORAGE_KEY = 'censo-barrio-familias'

function toApp(row) {
  if (!row) return null
  return {
    id: row.id,
    jefeFamilia: row.jefe_familia,
    cedula: row.cedula,
    nroIntegrantes: row.nro_integrantes,
    hayDiscapacidad: row.hay_discapacidad ?? false,
    detallesDiscapacidad: row.detalles_discapacidad ?? '',
    situacionVivienda: row.situacion_vivienda ?? 'Buena',
    nudoCriticoEspecifico: row.nudo_critico_especifico ?? '',
    createdBy: row.created_by ?? null,
  }
}

function toDb(f) {
  return {
    jefe_familia: f.jefeFamilia,
    cedula: f.cedula,
    nro_integrantes: f.nroIntegrantes,
    hay_discapacidad: f.hayDiscapacidad ?? false,
    detalles_discapacidad: f.detallesDiscapacidad ?? null,
    situacion_vivienda: f.situacionVivienda ?? 'Buena',
    nudo_critico_especifico: f.nudoCriticoEspecifico || null,
    created_by: f.createdBy ?? null,
  }
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

export function useFamilias() {
  const [familias, setFamilias] = useState([])
  const [loading, setLoading] = useState(true)
  const useDb = isSupabaseConfigured()

  useEffect(() => {
    if (useDb && supabase) {
      supabase
        .from('familias')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error cargando familias:', error)
            setFamilias(loadLocal())
          } else {
            setFamilias((data || []).map(toApp))
          }
          setLoading(false)
        })
    } else {
      setFamilias(loadLocal())
      setLoading(false)
    }
  }, [useDb])

  useEffect(() => {
    if (!useDb && familias.length >= 0) {
      saveLocal(familias)
    }
  }, [familias, useDb])

  const addFamilia = useCallback(
    async (familia, createdBy) => {
      const payload = { ...familia, createdBy: createdBy ?? null }
      if (useDb && supabase) {
        const { data, error } = await supabase
          .from('familias')
          .insert(toDb(payload))
          .select('id')
          .single()
        if (error) {
          console.error('Error guardando familia:', error)
          return null
        }
        const nueva = toApp({ ...payload, id: data.id })
        setFamilias((prev) => [nueva, ...prev])
        return data.id
      }
      const id = crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const nueva = { ...payload, id }
      setFamilias((prev) => [nueva, ...prev])
      return id
    },
    [useDb]
  )

  const updateFamilia = useCallback(
    async (id, datos) => {
      if (useDb && supabase) {
        const { error } = await supabase
          .from('familias')
          .update(toDb(datos))
          .eq('id', id)
        if (error) {
          console.error('Error actualizando familia:', error)
          return
        }
      }
      setFamilias((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...datos } : f))
      )
    },
    [useDb]
  )

  const deleteFamilia = useCallback(
    async (id) => {
      if (useDb && supabase) {
        const { error } = await supabase.from('familias').delete().eq('id', id)
        if (error) {
          console.error('Error eliminando familia:', error)
          return
        }
      }
      setFamilias((prev) => prev.filter((f) => f.id !== id))
    },
    [useDb]
  )

  const getFamiliaById = useCallback(
    (id) => familias.find((f) => f.id === id),
    [familias]
  )

  return {
    familias,
    loading,
    addFamilia,
    updateFamilia,
    deleteFamilia,
    getFamiliaById,
  }
}
