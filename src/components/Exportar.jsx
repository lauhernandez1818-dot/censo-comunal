import { FileJson, FileSpreadsheet, FileText } from 'lucide-react'
import { exportJSON, exportCSV, exportExcel } from '../utils/exportData'

export function Exportar({ familias, loading = false }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">Cargando...</p>
      </div>
    )
  }

  const baseBtn =
    'flex items-center gap-3 rounded-xl border px-6 py-4 font-medium shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none'
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-8 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-800">
        Exportar Datos
      </h2>
      <p className="mb-8 text-sm text-slate-600">
        Descargue toda la información del censo para respaldos o análisis en
        Excel u otros formatos.
      </p>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => exportExcel(familias)}
          disabled={familias.length === 0}
          className={`${baseBtn} border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:shadow-md disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400`}
        >
          <FileSpreadsheet className="h-8 w-8 text-emerald-600" strokeWidth={1.5} />
          <span>Descargar Excel</span>
        </button>
        <button
          onClick={() => exportJSON(familias)}
          disabled={familias.length === 0}
          className={`${baseBtn} border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 hover:shadow-md disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400`}
        >
          <FileJson className="h-8 w-8 text-blue-600" strokeWidth={1.5} />
          <span>Descargar JSON</span>
        </button>
        <button
          onClick={() => exportCSV(familias)}
          disabled={familias.length === 0}
          className={`${baseBtn} border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-md disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400`}
        >
          <FileText className="h-8 w-8 text-slate-600" strokeWidth={1.5} />
          <span>Descargar CSV</span>
        </button>
      </div>
      {familias.length === 0 && (
        <p className="mt-5 text-sm text-amber-600">
          No hay datos para exportar. Registre familias primero.
        </p>
      )}
    </div>
  )
}
