import { Users, Baby, User, UsersRound, Accessibility, AlertTriangle } from 'lucide-react'

export function DashboardCenso({ familias, loading }) {
  const totalFamilias = familias.length
  const totalPersonas = familias.reduce((s, f) => s + (f.nroIntegrantes ?? 0), 0)
  const totalNinos = familias.reduce((s, f) => s + (f.nroNinos ?? 0), 0)
  const totalAdultos = familias.reduce((s, f) => s + (f.nroAdultos ?? 0), 0)
  const totalAdultosMayores = familias.reduce((s, f) => s + (f.nroAdultosMayores ?? 0), 0)
  const conDiscapacidad = familias.filter((f) => f.discapacidad).length
  const nudosCriticos = familias.filter((f) => f.estadoVivienda === 'Malo').length

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-6"
          >
            <div className="h-12 w-12 rounded-lg bg-slate-200" />
            <div className="mt-3 h-4 w-32 rounded bg-slate-200" />
            <div className="mt-2 h-8 w-16 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    { icon: Users, title: 'Total Familias', value: totalFamilias, className: 'border-blue-200 bg-blue-50/50' },
    { icon: UsersRound, title: 'Total Personas', value: totalPersonas, className: 'border-slate-200 bg-slate-50/50' },
    { icon: Baby, title: 'Niños (0-17)', value: totalNinos, className: 'border-cyan-200 bg-cyan-50/50' },
    { icon: User, title: 'Adultos (18-59)', value: totalAdultos, className: 'border-indigo-200 bg-indigo-50/50' },
    { icon: UsersRound, title: 'Adultos Mayores (60+)', value: totalAdultosMayores, className: 'border-violet-200 bg-violet-50/50' },
    { icon: Accessibility, title: 'Con Discapacidad', value: conDiscapacidad, className: 'border-amber-200 bg-amber-50/50' },
    { icon: AlertTriangle, title: 'Nudos Críticos', value: nudosCriticos, className: 'border-red-200 bg-red-50/50' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map(({ icon: Icon, title, value, className }) => (
        <div
          key={title}
          className={`rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900/10 text-blue-900">
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">{title}</p>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
