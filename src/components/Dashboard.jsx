import { Users, Home, Accessibility, AlertTriangle } from 'lucide-react'
import { MetricCard } from './MetricCard'

export function Dashboard({ familias, loading }) {
  const totalFamilias = familias.length
  const totalPersonas = familias.reduce((s, f) => s + (f.nroIntegrantes || 0), 0)
  const conDiscapacidad = familias.filter((f) => f.hayDiscapacidad).length
  const viviendasMalas = familias.filter(
    (f) => f.situacionVivienda === 'Mala'
  ).length

  const nudosCriticos = familias
    .filter((f) => f.situacionVivienda === 'Mala' && f.nudoCriticoEspecifico)
    .reduce((acc, f) => {
      const nudo = f.nudoCriticoEspecifico.trim() || 'Sin especificar'
      acc[nudo] = (acc[nudo] || 0) + 1
      return acc
    }, {})

  const maxCount = Math.max(...Object.values(nudosCriticos), 1)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-slate-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
        Panel de Métricas
      </h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Users}
          title="Total Familias"
          value={totalFamilias}
        />
        <MetricCard
          icon={Home}
          title="Total Personas"
          value={totalPersonas}
        />
        <MetricCard
          icon={Accessibility}
          title="Familias con Discapacidad"
          value={conDiscapacidad}
        />
        <MetricCard
          icon={AlertTriangle}
          title="Viviendas en Mal Estado"
          value={viviendasMalas}
          className="border-red-200 bg-red-50/50"
        />
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow">
        <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-800">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Nudos Críticos (Viviendas en mal estado)
        </h3>
        {Object.keys(nudosCriticos).length === 0 ? (
          <p className="text-sm text-slate-600">
            No hay registros de nudos críticos.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(nudosCriticos)
              .sort((a, b) => b[1] - a[1])
              .map(([nudo, count]) => (
                <div key={nudo} className="flex items-center gap-4">
                  <span className="w-40 shrink-0 text-sm font-medium text-slate-700">
                    {nudo}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="h-7 overflow-hidden rounded-lg bg-slate-200">
                      <div
                        className="h-full rounded-lg bg-red-600 transition-all duration-500"
                        style={{
                          width: `${(count / maxCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-10 shrink-0 text-right text-sm font-semibold text-slate-800">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
