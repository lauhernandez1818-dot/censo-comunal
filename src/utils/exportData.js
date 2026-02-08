import * as XLSX from 'xlsx'

export function exportExcel(familias) {
  const headers = [
    'Jefe de Familia',
    'Cédula',
    'Total',
    'Niños',
    'Adultos',
    'Adultos Mayores',
    'Discapacidad',
    'Salud / Observación',
    'Estado Vivienda',
    'Nudo Crítico',
    'Registrado por',
  ]
  const rows = familias.map((f) => [
    f.jefeFamilia ?? '',
    f.cedula ?? '',
    f.nroIntegrantes ?? 0,
    f.nroNinos ?? 0,
    f.nroAdultos ?? 0,
    f.nroAdultosMayores ?? 0,
    f.discapacidad ? 'Sí' : 'No',
    f.saludObservacion ?? '',
    f.estadoVivienda ?? '',
    f.nudoCritico ?? '',
    f.usuarioCreador ?? '',
  ])
  const data = [headers, ...rows]
  const ws = XLSX.utils.aoa_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Censo')
  XLSX.writeFile(wb, `censo-barrio-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

export function exportJSON(familias) {
  const data = JSON.stringify(familias, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `censo-barrio-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function escapeCSV(value) {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportCSV(familias) {
  const headers = [
    'Jefe de Familia',
    'Cédula',
    'Nro Integrantes',
    '¿Hay Discapacidad?',
    'Detalles Discapacidad',
    'Situación Vivienda',
    'Nudo Crítico Específico',
    'Registrado por',
  ]
  const rows = familias.map((f) => [
    escapeCSV(f.jefeFamilia),
    escapeCSV(f.cedula),
    escapeCSV(f.nroIntegrantes),
    escapeCSV(f.hayDiscapacidad ? 'Sí' : 'No'),
    escapeCSV(f.detallesDiscapacidad),
    escapeCSV(f.situacionVivienda),
    escapeCSV(f.nudoCriticoEspecifico),
    escapeCSV(f.createdBy),
  ])
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `censo-barrio-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
