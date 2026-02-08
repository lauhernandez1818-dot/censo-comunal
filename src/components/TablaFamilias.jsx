import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { FormRegistro } from './FormRegistro'

export function TablaFamilias({
  familias,
  loading = false,
  onUpdate,
  onDelete,
  isAdmin = false,
  currentUsuario = null,
}) {
  const [editarId, setEditarId] = useState(null)
  const familiaEditar = editarId
    ? familias.find((f) => f.id === editarId)
    : null

  function canEdit(familia) {
    if (isAdmin) return true
    return familia.createdBy && familia.createdBy === currentUsuario
  }

  function handleUpdate(payload) {
    onUpdate(editarId, payload)
    setEditarId(null)
  }

  function handleDelete(id) {
    if (window.confirm('¿Eliminar esta familia del registro?')) {
      onDelete(id)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
        <p className="text-slate-600">Cargando...</p>
      </div>
    )
  }

  if (familias.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
        <p className="text-slate-600">No hay familias registradas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {familiaEditar && (
        <FormRegistro
          familiaEditar={familiaEditar}
          onSubmit={handleUpdate}
          onCancelEdit={() => setEditarId(null)}
        />
      )}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Jefe de Familia
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Cédula
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Integrantes
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Discapacidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Situación Vivienda
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Nudo Crítico
                </th>
                {isAdmin && (
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Registrado por
                  </th>
                )}
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {familias.map((f, idx) => (
                <tr
                  key={f.id}
                  className={`transition-colors hover:bg-slate-50 ${
                    editarId === f.id
                      ? 'bg-blue-50'
                      : idx % 2 === 1
                        ? 'bg-slate-50/50'
                        : ''
                  }`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">
                    {f.jefeFamilia}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                    {f.cedula}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                    {f.nroIntegrantes}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                    {f.hayDiscapacidad ? 'Sí' : 'No'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        f.situacionVivienda === 'Buena'
                          ? 'bg-emerald-100 text-emerald-800'
                          : f.situacionVivienda === 'Regular'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {f.situacionVivienda}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                    {f.nudoCriticoEspecifico || '-'}
                  </td>
                  {isAdmin && (
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                      {f.createdBy || '-'}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {canEdit(f) && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setEditarId(editarId === f.id ? null : f.id)
                          }
                          className="rounded p-2 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="rounded p-2 text-slate-600 transition-colors hover:bg-red-100 hover:text-red-700"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
