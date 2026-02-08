import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { Login } from './components/Login'
import { Layout } from './components/Layout'
import { useCensoFamilias } from './hooks/useCensoFamilias'
import { DashboardCenso } from './components/DashboardCenso'
import { FormCenso } from './components/FormCenso'
import { TablaCenso } from './components/TablaCenso'
import { GraficoViviendas } from './components/GraficoViviendas'
import { GraficoProblemaSalud } from './components/GraficoProblemaSalud'
import { GraficoDiscapacidadCondicion } from './components/GraficoDiscapacidadCondicion'
import { GraficoPoblacion } from './components/GraficoPoblacion'
import { ExportarCenso } from './components/ExportarCenso'

function AppContent() {
  const [vistaActiva, setVistaActiva] = useState('panel')
  const { user, logout, isAdmin } = useAuth()
  const { familias, loading, addFamilia, updateFamilia, deleteFamilia, useSupabase } = useCensoFamilias()
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [editingFamilia, setEditingFamilia] = useState(null)

  const miFamilia = isAdmin ? familias : familias.filter((f) => f.usuarioCreador === user?.usuario)
  const yaTieneFamilia = !isAdmin && miFamilia.length >= 1

  async function handleRegistro(familia) {
    setErrorMsg('')
    if (familia.id) {
      await updateFamilia(familia.id, familia)
      setSuccessMsg('Familia actualizada correctamente.')
      setEditingFamilia(null)
      setTimeout(() => setSuccessMsg(''), 3000)
      return
    }
    if (yaTieneFamilia) {
      setErrorMsg('Solo puede registrar una familia. Véala en Mi Familia.')
      return
    }
    const id = await addFamilia(familia, isAdmin ? null : user?.usuario)
    if (id) {
      setSuccessMsg('Familia registrada correctamente.')
      setTimeout(() => setSuccessMsg(''), 3000)
      setVistaActiva('base')
    } else {
      setErrorMsg('No se pudo guardar. Revise la consola del navegador.')
    }
  }

  return (
    <Layout
      vistaActiva={vistaActiva}
      onCambiarVista={setVistaActiva}
      user={user}
      onLogout={logout}
      isAdmin={isAdmin}
      useSupabase={useSupabase}
    >
      {vistaActiva === 'panel' && (
        <section className="min-w-0 space-y-6">
          <div className="min-w-0 border-b border-slate-200 pb-4">
            <h2 className="break-words text-xl font-semibold text-slate-800 sm:text-2xl">
              {isAdmin ? 'Panel de Métricas' : 'Resumen de Mi Familia'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {isAdmin ? 'Resumen del censo comunal' : 'Datos de su familia registrada'}
            </p>
          </div>
          <DashboardCenso familias={miFamilia} loading={loading} esMiFamilia={!isAdmin} />
        </section>
      )}

      {vistaActiva === 'registro' && (
        <section className="min-w-0 space-y-6">
          <div className="min-w-0 border-b border-slate-200 pb-4">
            <h2 className="break-words text-xl font-semibold text-slate-800 sm:text-2xl">
              {isAdmin ? 'Registro de Familias' : 'Registrar Mi Familia'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {isAdmin ? 'Ingrese los datos de la familia a censar' : 'Complete los datos de su familia (un registro por usuario)'}
            </p>
          </div>
          {yaTieneFamilia ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-6 text-center sm:p-8">
              <p className="font-medium text-emerald-800">Ya registró su familia.</p>
              <p className="mt-1 text-sm text-emerald-700">Puede verla y editarla en <strong>Mi Familia</strong>.</p>
              <button
                type="button"
                onClick={() => setVistaActiva('base')}
                className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Ir a Mi Familia
              </button>
            </div>
          ) : (
            <FormCenso onSubmit={handleRegistro} />
          )}
          {successMsg && (
            <p className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
              {successMsg}
            </p>
          )}
          {errorMsg && (
            <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
              {errorMsg}
            </p>
          )}
        </section>
      )}

      {vistaActiva === 'base' && (
        <section className="min-w-0 space-y-6">
          <div className="min-w-0 border-b border-slate-200 pb-4">
            <h2 className="break-words text-xl font-semibold text-slate-800 sm:text-2xl">
              {isAdmin ? 'Base de Datos' : 'Mi Familia'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {isAdmin ? 'Todos los registros del censo (actualización en tiempo real)' : 'Los datos de su familia registrada'}
            </p>
          </div>
          {isAdmin && editingFamilia && (
            <div className="min-w-0 max-w-full overflow-hidden rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4 sm:p-6">
              <h3 className="mb-4 font-semibold text-slate-800">Editar familia: {editingFamilia.jefeFamilia}</h3>
              <FormCenso
                initialData={editingFamilia}
                onSubmit={handleRegistro}
                onCancel={() => setEditingFamilia(null)}
              />
              {successMsg && (
                <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                  {successMsg}
                </p>
              )}
            </div>
          )}
          <TablaCenso
            familias={miFamilia}
            loading={loading}
            onDelete={deleteFamilia}
            onEdit={isAdmin ? setEditingFamilia : undefined}
            isAdmin={isAdmin}
            esMiFamilia={!isAdmin}
          />
        </section>
      )}

      {isAdmin && vistaActiva === 'grafico' && (
        <section className="min-w-0 space-y-8">
          <div className="min-w-0 border-b border-slate-200 pb-4">
            <h2 className="break-words text-xl font-semibold text-slate-800 sm:text-2xl">
              Gráficos
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Resumen visual del censo: viviendas, salud, discapacidad y población por edad
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            <GraficoViviendas familias={familias} />
            <GraficoProblemaSalud familias={familias} />
            <GraficoDiscapacidadCondicion familias={familias} />
            <GraficoPoblacion familias={familias} />
          </div>
        </section>
      )}

      {isAdmin && vistaActiva === 'exportar' && (
        <section className="min-w-0 space-y-6">
          <div className="min-w-0 border-b border-slate-200 pb-4">
            <h2 className="break-words text-xl font-semibold text-slate-800 sm:text-2xl">
              Exportar Datos
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Descargue la base de datos para respaldos
            </p>
          </div>
          <ExportarCenso familias={familias} loading={loading} />
        </section>
      )}
    </Layout>
  )
}

function App() {
  const { user, login, register } = useAuth()

  if (!user) {
    return <Login onLogin={login} onRegister={register} />
  }

  return <AppContent />
}

export default App
