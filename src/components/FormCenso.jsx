import { useState } from 'react'

const ESTADO_OPCIONES = ['Bueno', 'Regular', 'Malo']

const INITIAL = {
  jefeFamilia: '',
  cedula: '',
  nroIntegrantes: '',
  nroNinos: 0,
  nroAdultos: 0,
  nroAdultosMayores: 0,
  discapacidad: false,
  saludObservacion: '',
  estadoVivienda: 'Bueno',
  nudoCritico: '',
}

export function FormCenso({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState(
    initialData
      ? {
          jefeFamilia: initialData.jefeFamilia ?? '',
          cedula: initialData.cedula ?? '',
          nroIntegrantes: initialData.nroIntegrantes ?? '',
          nroNinos: initialData.nroNinos ?? 0,
          nroAdultos: initialData.nroAdultos ?? 0,
          nroAdultosMayores: initialData.nroAdultosMayores ?? 0,
          discapacidad: initialData.discapacidad ?? false,
          saludObservacion: initialData.saludObservacion ?? '',
          estadoVivienda: initialData.estadoVivienda ?? 'Bueno',
          nudoCritico: initialData.nudoCritico ?? '',
        }
      : INITIAL
  )
  const [errores, setErrores] = useState({})

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    const isNum = ['nroNinos', 'nroAdultos', 'nroAdultosMayores'].includes(name)
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : isNum ? (value === '' ? '' : Number(value)) : value,
    }))
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: null }))
  }

  function validate() {
    const err = {}
    if (!form.jefeFamilia.trim()) err.jefeFamilia = 'Requerido'
    if (!form.cedula.trim()) err.cedula = 'Requerido'
    const ninos = Number(form.nroNinos) || 0
    const adultos = Number(form.nroAdultos) || 0
    const mayores = Number(form.nroAdultosMayores) || 0
    const total = ninos + adultos + mayores
    if (total < 1) err.nroIntegrantes = 'Debe haber al menos 1 integrante'
    setErrores(err)
    return Object.keys(err).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    const ninos = Number(form.nroNinos) || 0
    const adultos = Number(form.nroAdultos) || 0
    const mayores = Number(form.nroAdultosMayores) || 0
    onSubmit({
      ...form,
      id: initialData?.id,
      nroIntegrantes: ninos + adultos + mayores,
      nroNinos: ninos,
      nroAdultos: adultos,
      nroAdultosMayores: mayores,
    })
    if (!initialData) setForm(INITIAL)
  }

  const inputClass = (name) =>
    `w-full rounded-lg border px-3 py-2.5 text-slate-800 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
      errores[name] ? 'border-red-500' : 'border-slate-300'
    }`

  const total = (Number(form.nroNinos) || 0) + (Number(form.nroAdultos) || 0) + (Number(form.nroAdultosMayores) || 0)

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-3 rounded-lg bg-blue-50/80 border border-blue-100 p-4">
          <p className="text-sm text-blue-800">
            <strong>Datos básicos</strong> — Complete con la información del jefe o jefa de familia.
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Jefe o Jefa de Familia <span className="text-red-500">*</span>
          </label>
          <input
            name="jefeFamilia"
            value={form.jefeFamilia}
            onChange={handleChange}
            className={inputClass('jefeFamilia')}
            placeholder="Ej: María González"
            autoComplete="name"
          />
          {errores.jefeFamilia && (
            <p className="mt-1 text-sm text-red-600">{errores.jefeFamilia}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Cédula <span className="text-red-500">*</span>
          </label>
          <input
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
            className={inputClass('cedula')}
            placeholder="Ej: V-12345678 o J-87654321"
          />
          {errores.cedula && (
            <p className="mt-1 text-sm text-red-600">{errores.cedula}</p>
          )}
        </div>
        <div className="sm:col-span-2 lg:col-span-3 rounded-lg bg-slate-50 border border-slate-200 p-4">
          <p className="text-sm text-slate-700 mb-3">
            <strong>Integrantes del hogar</strong> — Indique cuántas personas hay en cada rango de edad.
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Niños (0-17 años)
          </label>
          <input
            name="nroNinos"
            type="number"
            min="0"
            value={form.nroNinos === '' ? '' : form.nroNinos}
            onChange={handleChange}
            className={inputClass('nroNinos')}
            placeholder="0"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Adultos (18-59 años)
          </label>
          <input
            name="nroAdultos"
            type="number"
            min="0"
            value={form.nroAdultos === '' ? '' : form.nroAdultos}
            onChange={handleChange}
            className={inputClass('nroAdultos')}
            placeholder="0"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Adultos Mayores (60+ años)
          </label>
          <input
            name="nroAdultosMayores"
            type="number"
            min="0"
            value={form.nroAdultosMayores === '' ? '' : form.nroAdultosMayores}
            onChange={handleChange}
            className={inputClass('nroAdultosMayores')}
            placeholder="0"
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-2">
          <span className="text-sm text-slate-600">Total integrantes: <strong>{total}</strong></span>
          {total >= 1 && <span className="text-xs text-emerald-600">✓</span>}
        </div>
        {errores.nroIntegrantes && (
          <p className="sm:col-span-2 lg:col-span-3 text-sm text-red-600">
            {errores.nroIntegrantes}
          </p>
        )}
        <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-3">
          <input
            id="discapacidad"
            name="discapacidad"
            type="checkbox"
            checked={form.discapacidad}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          />
          <label htmlFor="discapacidad" className="text-sm font-medium text-slate-700">
            Discapacidad
          </label>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Salud / Observación
          </label>
          <textarea
            name="saludObservacion"
            value={form.saludObservacion}
            onChange={handleChange}
            rows={2}
            className={inputClass('saludObservacion')}
            placeholder="Ej: Alergias, medicación, condiciones especiales (opcional)"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Estado de Vivienda
          </label>
          <select
            name="estadoVivienda"
            value={form.estadoVivienda}
            onChange={handleChange}
            className={inputClass('estadoVivienda')}
          >
            {ESTADO_OPCIONES.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nudo Crítico
          </label>
          <input
            name="nudoCritico"
            value={form.nudoCritico}
            onChange={handleChange}
            className={inputClass('nudoCritico')}
            placeholder="Dejar vacío si no hay problemas"
          />
        </div>
        <div className="flex items-end sm:col-span-2 lg:col-span-3">
          <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={total < 1}
          >
            {initialData ? 'Actualizar Familia' : 'Guardar Familia'}
          </button>
        </div>
        </div>
      </form>
    </div>
  )
}
