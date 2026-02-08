export function MetricCard({ icon: Icon, title, value, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900/10 text-blue-900 transition-colors">
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  )
}
