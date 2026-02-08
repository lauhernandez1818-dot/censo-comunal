import { useState, useEffect } from 'react'

const SITUACION_OPCIONES = ['Buena', 'Regular', 'Mala']
const NUDO_CRITICO_OPCIONES = [
  'Techo',
  'Aguas servidas',
  'Paredes',
  'Piso',
  'Electricidad',
  'Otro',
]

const INITIAL_STATE = {
  jefeFamilia: '',
  cedula: '',
  nroIntegrantes: '',
  hayDiscapacidad: false,
  detallesDiscapacidad: '',
  situacionVivienda: 'Buena',
  nudoCriticoEspecifico: '',
}

export function FormRegistro({ onSubmit, familiaEditar, onCancelEdit }) {
  const [form, setForm] = useState(INITIAL_STATE)
  const [nudoOtro, setNudoOtro] = useState('')
  const [errores, setErrores] = useState({})
  const isEditing = !!familiaEditar

  useEffect(() => {
    if (familiaEditar) {
      setForm({
        jefeFamilia: familiaEditar.jefeFamilia ?? '',
        cedula: familiaEditar.cedula ?? '',
        nroIntegrantes: familiaEditar.nroIntegrantes ?? '',
        hayDiscapacidad: familiaEditar.hayDiscapacidad ?? false,
        detallesDiscapacidad: familiaEditar.detallesDiscapacidad ?? '',
        situacionVivienda: familiaEditar.situacionVivienda ?? 'Buena',
        nudoCriticoEspecifico: familiaEditar.nudoCriticoEspecifico ?? '',
      })
      if (
        familiaEditar.nudoCriticoEspecifico &&
        !NUDO_CRITICO_OPCIONES.includes(familiaEditar.nudoCriticoEspecifico)
      ) {
        setNudoOtro(familiaEditar.nudoCriticoEspecifico)
      } else {
        setNudoOtro('')
      }
    } else {
      setForm(INITIAL_STATE)
      setNudoOtro('')
    }
    setErrores({})
  }, [familiaEditar])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: null }))
  }

  function validate() {
    const err = {}
    if (!form.jefeFamilia.trim()) err.jefeFamilia = 'Requerido'
    if (!form.cedula.trim()) err.cedula = 'Requerido'
    const nro = Number(form.nroIntegrantes)
    if (!form.nroIntegrantes || isNaN(nro) || nro < 1)
      err.nroIntegrantes = 'Debe ser un número mayor a 0'
    setErrores(err)
    return Object.keys(err).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    const nudo =
      form.nudoCriticoEspecifico === 'Otro' ? nudoOtro : form.nudoCriticoEspecifico
    const payload = {
      ...form,
      nroIntegrantes: Number(form.nroIntegrantes),
      nudoCriticoEspecifico: nudo || form.nudoCriticoEspecifico,
    }
    onSubmit(payload)
    if (!isEditing) setForm(INITIAL_STATE)
    if (onCancelEdit) onCancelEdit()
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-8 shadow-sm">
      <h2 className="mb-8 text-xl font-semibold tracking-tight text-slate-800">
        {isEditing ? 'Editar Familia' : 'Registrar Nueva Familia'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="jefeFamilia"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Jefe de Familia
          </label>
          <input
            id="jefeFamilia"
            name="jefeFamilia"
            type="text"
            value={form.jefeFamilia}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2.5 text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
              errores.jefeFamilia ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-300'
            }`}
            placeholder="Nombre completo"
          />
          {errores.jefeFamilia && (
            <p className="mt-1 text-sm text-red-600">{errores.jefeFamilia}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="cedula"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Cédula
          </label>
          <input
            id="cedula"
            name="cedula"
            type="text"
            value={form.cedula}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2.5 text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
              errores.cedula ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-300'
            }`}
            placeholder="Ej: V-12345678"
          />
          {errores.cedula && (
            <p className="mt-1 text-sm text-red-600">{errores.cedula}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="nroIntegrantes"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Nro. Integrantes
          </label>
          <input
            id="nroIntegrantes"
            name="nroIntegrantes"
            type="number"
            min="1"
            value={form.nroIntegrantes}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2.5 text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
              errores.nroIntegrantes ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-300'
            }`}
          />
          {errores.nroIntegrantes && (
            <p className="mt-1 text-sm text-red-600">
              {errores.nroIntegrantes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="hayDiscapacidad"
            name="hayDiscapacidad"
            type="checkbox"
            checked={form.hayDiscapacidad}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          />
          <label
            htmlFor="hayDiscapacidad"
            className="text-sm font-medium text-slate-700"
          >
            ¿Hay Discapacidad?
          </label>
        </div>

        {form.hayDiscapacidad && (
          <div>
            <label
              htmlFor="detallesDiscapacidad"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Detalles Discapacidad (opcional)
            </label>
            <textarea
              id="detallesDiscapacidad"
              name="detallesDiscapacidad"
              value={form.detallesDiscapacidad}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Describa brevemente"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="situacionVivienda"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Situación Vivienda
          </label>
          <select
            id="situacionVivienda"
            name="situacionVivienda"
            value={form.situacionVivienda}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {SITUACION_OPCIONES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="nudoCriticoEspecifico"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Nudo Crítico Específico
          </label>
          <select
            id="nudoCriticoEspecifico"
            name="nudoCriticoEspecifico"
            value={form.nudoCriticoEspecifico}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">Seleccione...</option>
            {NUDO_CRITICO_OPCIONES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {form.nudoCriticoEspecifico === 'Otro' && (
            <input
              type="text"
              value={nudoOtro}
              onChange={(e) => setNudoOtro(e.target.value)}
              placeholder="Especifique"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          )}
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            className="rounded-lg bg-blue-900 px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEditing ? 'Guardar Cambios' : 'Guardar Familia'}
          </button>
          {isEditing && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
