import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export function GraficoProblemaSalud({ familias }) {
  const conProblema = familias.filter((f) => f.saludObservacion && String(f.saludObservacion).trim()).length
  const sinProblema = familias.length - conProblema
  const datos = [
    { nombre: 'Con problema de salud', cantidad: conProblema, fill: '#dc2626' },
    { nombre: 'Sin problema', cantidad: sinProblema, fill: '#16a34a' },
  ]

  if (familias.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <p className="text-slate-500">Sin datos</p>
      </div>
    )
  }

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Problema de salud (familias)
      </h3>
      <div className="h-56 min-h-0 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" stroke="#64748b" fontSize={12} />
            <YAxis type="category" dataKey="nombre" stroke="#64748b" fontSize={12} width={75} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
              formatter={(value) => [value, 'Familias']}
            />
            <Bar dataKey="cantidad" name="Familias" radius={[0, 4, 4, 0]}>
            {datos.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
