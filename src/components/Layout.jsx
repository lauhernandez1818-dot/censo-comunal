import {
  LayoutDashboard,
  UserPlus,
  Database,
  Home,
  BarChart3,
  Download,
  LogOut,
  User,
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

export function Layout({ vistaActiva, onCambiarVista, user, onLogout, isAdmin, children }) {
  const navItems = isAdmin ? NAV_ADMIN : NAV_USUARIO
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200/80 bg-blue-900 text-white shadow-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight">
            Censo Comunal
          </h1>
          <div className="flex items-center gap-2">
            <nav className="flex gap-0.5 rounded-lg bg-white/5 p-0.5">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onCambiarVista(id)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                    vistaActiva === id
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {label}
                </button>
              ))}
            </nav>
            <div className="ml-2 flex items-center gap-2 border-l border-white/25 pl-3">
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
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
