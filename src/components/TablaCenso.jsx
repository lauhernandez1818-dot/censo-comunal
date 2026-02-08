import { Database, Trash2, Home, Pencil } from 'lucide-react'

export function TablaCenso({ familias, loading, onDelete, onEdit, isAdmin = false, esMiFamilia = false }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
        <p className="text-slate-600">Cargando...</p>
      </div>
    )
  }

  if (familias.length === 0) {
    const Icon = esMiFamilia ? Home : Database
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
        <Icon className="mx-auto mb-3 h-12 w-12 text-slate-300" />
        <p className="text-slate-600">
          {esMiFamilia ? 'Aún no ha registrado su familia.' : 'No hay registros aún.'}
        </p>
        {esMiFamilia && (
          <p className="mt-1 text-sm text-slate-500">Vaya a <strong>Registro</strong> para completar el censo.</p>
        )}
      </div>
    )
  }

  return (
    <div className="w-full max-w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div className="max-w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 sm:px-4">
                Jefe de Familia
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 sm:px-4">
                Cédula
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 sm:px-4">
                Total
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 sm:px-4">
                Niños
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 sm:px-4">
                Adultos
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 sm:px-4">
                A. Mayores
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 sm:px-4">
                Disc. / Cond.
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 sm:px-4">
                Estado Vivienda
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 sm:px-4">
                Nudo Crítico
              </th>
              {isAdmin && (
                <th className="px-2 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 sm:px-4">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {familias.map((f, idx) => (
              <tr
                key={f.id}
                className={`transition-colors hover:bg-slate-50 ${
                  idx % 2 === 1 ? 'bg-slate-50/50' : ''
                }`}
              >
                <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-800 sm:px-4">
                  {f.jefeFamilia}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-600 sm:px-4 sm:text-sm">
                  {f.cedula}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-700">
                  {f.nroIntegrantes}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                  {f.nroNinos ?? 0}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                  {f.nroAdultos ?? 0}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                  {f.nroAdultosMayores ?? 0}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                  {f.discapacidadCondicion === 'discapacidad' ? 'Discapacidad' : f.discapacidadCondicion === 'condicion' ? 'Condición' : 'No'}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      f.estadoVivienda === 'Bueno'
                        ? 'bg-emerald-100 text-emerald-800'
                        : f.estadoVivienda === 'Regular'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {f.estadoVivienda}
                  </span>
                </td>
                <td className="max-w-[120px] break-words px-4 py-3 text-sm text-slate-600 sm:max-w-[200px]">
                  {f.nudoCritico || '-'}
                </td>
                {isAdmin && (
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit?.(f)}
                        className="rounded p-2 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('¿Eliminar esta familia del registro?')) {
                            onDelete?.(f.id)
                          }
                        }}
                        className="rounded p-2 text-slate-600 transition-colors hover:bg-red-100 hover:text-red-700"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
