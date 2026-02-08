import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export function GraficoViviendas({ familias }) {
  const datos = ['Bueno', 'Regular', 'Malo'].map((estado) => ({
    estado,
    cantidad: familias.filter((f) => f.estadoVivienda === estado).length,
  }))

  if (familias.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <p className="text-slate-500">Sin datos para el gráfico</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Estado de las Viviendas
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="estado" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
              formatter={(value) => [value, 'Familias']}
            />
            <Legend />
            <Bar
              dataKey="cantidad"
              name="Familias"
              fill="#1e40af"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
