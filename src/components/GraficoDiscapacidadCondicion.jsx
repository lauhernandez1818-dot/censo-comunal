import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export function GraficoDiscapacidadCondicion({ familias }) {
  const ninguna = familias.filter((f) => !f.discapacidadCondicion || f.discapacidadCondicion === 'ninguna').length
  const discapacidad = familias.filter((f) => f.discapacidadCondicion === 'discapacidad').length
  const condicion = familias.filter((f) => f.discapacidadCondicion === 'condicion').length
  const datos = [
    { tipo: 'Ninguna', cantidad: ninguna, fill: '#94a3b8' },
    { tipo: 'Discapacidad', cantidad: discapacidad, fill: '#f59e0b' },
    { tipo: 'Condición especial', cantidad: condicion, fill: '#8b5cf6' },
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
        Discapacidad / Condición (familias)
      </h3>
      <div className="h-56 min-h-0 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="tipo" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
              formatter={(value) => [value, 'Familias']}
            />
            <Bar dataKey="cantidad" name="Familias" radius={[4, 4, 0, 0]}>
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
