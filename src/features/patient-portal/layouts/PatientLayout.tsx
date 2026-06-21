import { Outlet, useNavigate, Link, NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, LogOut, Sparkles, Dumbbell } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function PatientLayout() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Paciente'

  const handleLogout = () => {
    signOut()
    toast.success('Hasta pronto 👋')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/patient/dashboard" className="flex items-center gap-2">
            <Logo size={28} showWordmark />
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">PACIENTE</span>
          </Link>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="size-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
                  {firstName[0]}
                </div>
                <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-amber-400 flex items-center justify-center">
                  <Sparkles className="size-1.5 text-white" />
                </span>
              </div>
              <span className="text-xs font-semibold text-foreground hidden sm:block">{firstName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:block">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm">
        <div className="flex max-w-2xl mx-auto">
          {[
            { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Signos' },
            { to: '/patient/lifestyle', icon: Dumbbell, label: 'Hábitos' },
            { to: '/patient/log-vitals', icon: ClipboardList, label: 'Cargar V.' },
          ].map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )
              }
            >
              <Icon className="size-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24 sm:pb-24">
        <Outlet />
      </main>
    </div>
  )
}
