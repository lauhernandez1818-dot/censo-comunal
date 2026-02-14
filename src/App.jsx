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
  const { user, logout, isAdmin, isJefaCalle } = useAuth()
  const { familias, loading, addFamilia, updateFamilia, deleteFamilia, useSupabase } = useCensoFamilias()
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [editingFamilia, setEditingFamilia] = useState(null)

  // Filtrar familias según rol
  let miFamilia = familias
  if (isAdmin) {
    // Admin ve todas las familias
    miFamilia = familias
  } else if (isJefaCalle) {
    // Jefa de calle ve su familia + familias de su comunidad (usuarios con su jefa_calle_id)
    miFamilia = familias.filter((f) => f.jefaCalleId === user?.id || f.usuarioCreador === user?.usuario)
  } else {
    // Usuario normal solo ve su familia
    miFamilia = familias.filter((f) => f.usuarioCreador === user?.usuario)
  }

  const yaTieneFamilia = !isAdmin && !isJefaCalle && miFamilia.length >= 1

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
    // Obtener jefa_calle_id del usuario que crea la familia
    let jefaCalleId = null
    if (!isAdmin && !isJefaCalle && user?.jefaCalleId) {
      jefaCalleId = user.jefaCalleId
    } else if (isJefaCalle) {
      jefaCalleId = user?.id // La jefa de calle es su propia jefa
    }
    
    const result = await addFamilia(familia, isAdmin || isJefaCalle ? null : user?.usuario, jefaCalleId)
    if (result?.id) {
      if (result.savedToSupabase) {
        setSuccessMsg('Familia registrada correctamente en la nube.')
      } else {
        setSuccessMsg('Familia guardada solo en este dispositivo.')
        setErrorMsg(result.error ? `Supabase: ${result.error}` : 'No se pudo conectar con Supabase. Revise .env (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY) y que la tabla censo_familias exista.')
      }
      setTimeout(() => { setSuccessMsg(''); setErrorMsg('') }, 5000)
      setVistaActiva('base')
    } else {
      setErrorMsg('No se pudo guardar.')
    }
  }

  return (
    <Layout
      vistaActiva={vistaActiva}
      onCambiarVista={setVistaActiva}
      user={user}
      onLogout={logout}
      isAdmin={isAdmin}
      isJefaCalle={isJefaCalle}
      useSupabase={useSupabase}
    >
      {vistaActiva === 'panel' && (
        <section className="min-w-0 space-y-6">
          <div className="min-w-0 border-b border-slate-200 pb-4">
            <h2 className="break-words text-xl font-semibold text-slate-800 sm:text-2xl">
              {isAdmin ? 'Panel de Métricas' : isJefaCalle ? 'Panel de Mi Comunidad' : 'Resumen de Mi Familia'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {isAdmin ? 'Resumen del censo comunal' : isJefaCalle ? 'Resumen de las familias de su comunidad' : 'Datos de su familia registrada'}
            </p>
          </div>
          <DashboardCenso familias={miFamilia} loading={loading} esMiFamilia={!isAdmin} />
        </section>
      )}

      {vistaActiva === 'registro' && (
        <section className="min-w-0 space-y-6">
          <div className="min-w-0 border-b border-slate-200 pb-4">
            <h2 className="break-words text-xl font-semibold text-slate-800 sm:text-2xl">
              {isAdmin ? 'Registro de Familias' : isJefaCalle ? 'Registro de Familias' : 'Registrar Mi Familia'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {isAdmin || isJefaCalle ? 'Ingrese los datos de la familia a censar' : 'Complete los datos de su familia (un registro por usuario)'}
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
              {isAdmin ? 'Base de Datos' : isJefaCalle ? 'Familias de Mi Comunidad' : 'Mi Familia'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {isAdmin ? 'Todos los registros del censo (actualización en tiempo real)' : isJefaCalle ? 'Familias registradas en su comunidad' : 'Los datos de su familia registrada'}
            </p>
          </div>
          {(isAdmin || isJefaCalle) && editingFamilia && (
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
            onEdit={(isAdmin || isJefaCalle) ? setEditingFamilia : undefined}
            isAdmin={isAdmin || isJefaCalle}
            esMiFamilia={!isAdmin && !isJefaCalle}
          />
        </section>
      )}

      {(isAdmin || isJefaCalle) && vistaActiva === 'grafico' && (
        <section className="min-w-0 space-y-8">
          <div className="min-w-0 border-b border-slate-200 pb-4">
            <h2 className="break-words text-xl font-semibold text-slate-800 sm:text-2xl">
              Gráficos
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {isAdmin 
                ? 'Resumen visual del censo: viviendas, salud, discapacidad y población por edad'
                : 'Resumen visual de su comunidad: viviendas, salud, discapacidad y población por edad'}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            <GraficoViviendas familias={miFamilia} />
            <GraficoProblemaSalud familias={miFamilia} />
            <GraficoDiscapacidadCondicion familias={miFamilia} />
            <GraficoPoblacion familias={miFamilia} />
          </div>
        </section>
      )}

      {(isAdmin || isJefaCalle) && vistaActiva === 'exportar' && (
        <section className="min-w-0 space-y-6">
          <div className="min-w-0 border-b border-slate-200 pb-4">
            <h2 className="break-words text-xl font-semibold text-slate-800 sm:text-2xl">
              Exportar Datos
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {isAdmin 
                ? 'Descargue la base de datos para respaldos'
                : 'Descargue los datos de su comunidad para respaldos'}
            </p>
          </div>
          <ExportarCenso familias={miFamilia} loading={loading} />
        </section>
      )}
    </Layout>
  )
}

function App() {
  const { user, login, register, sendOTP, verifyOTP } = useAuth()

  if (!user) {
    return <Login onLogin={login} onRegister={register} onSendOTP={sendOTP} onVerifyOTP={verifyOTP} />
  }

  return <AppContent />
}

export default App
