import { Download, FileSpreadsheet } from 'lucide-react'
import { exportExcel } from '../utils/exportData'

export function ExportarCenso({ familias, loading = false }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
        <p className="text-slate-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-8 shadow-sm">
      <p className="mb-6 text-slate-600">
        Descargue toda la información del censo en formato Excel para respaldos o
        análisis externos.
      </p>
      <button
        onClick={() => exportExcel(familias)}
        disabled={familias.length === 0}
        className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4 font-medium text-emerald-800 transition-all hover:bg-emerald-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-50 disabled:hover:shadow-none"
      >
        <FileSpreadsheet className="h-8 w-8 text-emerald-600" strokeWidth={1.5} />
        <span>Descargar Excel</span>
        <Download className="h-5 w-5" strokeWidth={2} />
      </button>
      {familias.length === 0 && (
        <p className="mt-4 text-sm text-amber-600">
          No hay datos para exportar. Registre familias primero.
        </p>
      )}
    </div>
  )
}
