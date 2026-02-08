import {
  LayoutDashboard,
  UserPlus,
  Database,
  Home,
  BarChart3,
  Download,
  LogOut,
  User,
  AlertTriangle,
} from 'lucide-react'

const NAV_ADMIN = [
  { id: 'panel', label: 'Panel', icon: LayoutDashboard },
  { id: 'registro', label: 'Registro', icon: UserPlus },
  { id: 'base', label: 'Base de Datos', icon: Database },
  { id: 'grafico', label: 'Gráfico', icon: BarChart3 },
  { id: 'exportar', label: 'Exportar', icon: Download },
]

const NAV_USUARIO = [
  { id: 'panel', label: 'Panel', icon: LayoutDashboard },
  { id: 'registro', label: 'Registro', icon: UserPlus },
  { id: 'base', label: 'Mi Familia', icon: Home },
]

export function Layout({ vistaActiva, onCambiarVista, user, onLogout, isAdmin, useSupabase = true, children }) {
  const navItems = isAdmin ? NAV_ADMIN : NAV_USUARIO
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <header className="border-b border-slate-200/80 bg-blue-900 text-white shadow-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-4">
          <h1 className="text-base font-semibold tracking-tight sm:text-lg">
            Censo Comunal
          </h1>
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
            <nav className="flex min-w-0 gap-0.5 overflow-x-auto rounded-lg bg-white/5 p-0.5 scrollbar-none [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none]">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onCambiarVista(id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium transition-all sm:gap-2 sm:px-3 sm:text-sm ${
                    vistaActiva === id
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  <span className="whitespace-nowrap">{label}</span>
                </button>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2 border-t border-white/25 pt-2 sm:ml-2 sm:border-l sm:border-t-0 sm:pt-0 sm:pl-3">
              <User className="h-4 w-4 text-blue-200" strokeWidth={2} />
              <span className="text-sm font-medium text-blue-50">{user?.usuario}</span>
              <span className="rounded-md bg-white/20 px-2 py-1 text-xs font-medium">
                {user?.rol === 'admin' ? 'Administradora' : 'Usuario'}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-blue-100 transition-colors hover:bg-white/10 hover:text-white"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" strokeWidth={2} />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>
      {!useSupabase && (
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
            <div>
              <p className="font-medium">Usando almacenamiento local</p>
              <p className="text-sm">
                Los datos solo se guardan en este dispositivo. Para que todos vean las mismas familias, configure Supabase en Vercel (variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY) y ejecute el SQL en su proyecto Supabase.
              </p>
            </div>
          </div>
        </div>
      )}
      <main className="mx-auto w-full max-w-6xl overflow-x-hidden px-3 py-6 sm:px-4 sm:py-8">{children}</main>
    </div>
  )
}
