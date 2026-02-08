import { useState } from 'react'
import { LayoutDashboard, Download } from 'lucide-react'
import { useCensoFamilias } from './hooks/useCensoFamilias'
import { DashboardCenso } from './components/DashboardCenso'
import { FormCenso } from './components/FormCenso'
import { TablaCenso } from './components/TablaCenso'
import { GraficoViviendas } from './components/GraficoViviendas'

function exportJSON(familias) {
  const data = JSON.stringify(familias, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `censo-comunal-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AppCenso() {
  const { familias, loading, addFamilia } = useCensoFamilias()
  const [successMsg, setSuccessMsg] = useState('')

  async function handleSubmit(familia) {
    const id = await addFamilia(familia)
    if (id) {
      setSuccessMsg('Familia registrada correctamente.')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-blue-900 text-white shadow-md">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <LayoutDashboard className="h-6 w-6" />
            Censo Comunal
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Dashboard
          </h2>
          <DashboardCenso familias={familias} loading={loading} />
        </section>

        <section>
          <FormCenso onSubmit={handleSubmit} />
          {successMsg && (
            <p className="mt-3 text-sm font-medium text-emerald-600">
              {successMsg}
            </p>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Base de Datos
            </h2>
            <button
              onClick={() => exportJSON(familias)}
              disabled={familias.length === 0}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Exportar JSON
            </button>
          </div>
          <TablaCenso familias={familias} loading={loading} />
        </section>

        <section>
          <GraficoViviendas familias={familias} />
        </section>
      </main>
    </div>
  )
}
