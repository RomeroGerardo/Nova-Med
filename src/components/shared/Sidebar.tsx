import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { getInitials } from '@/lib/utils'
import { Logo } from './Logo'
import { isDemoUser } from '@/lib/demoAuth'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Pacientes' },
  { to: '/patients/new/tracking', icon: Activity, label: 'Seguimiento' },
  { to: '/settings', icon: Settings, label: 'Configuración' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    if (!isDemoUser(user?.id)) {
      await supabase.auth.signOut()
    }
    signOut()
    toast.success(isDemoUser(user?.id) ? 'Saliste del modo Demo' : 'Sesión cerrada correctamente')
    navigate('/login')
  }

  return (
    <aside
      className={cn(
        'relative flex flex-col bg-card border-r border-border sidebar-transition overflow-hidden',
        collapsed ? 'w-[72px]' : 'w-[280px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-5 py-5 border-b border-border',
        collapsed && 'justify-center px-3'
      )}>
        <Logo
          size={34}
          showWordmark={!collapsed}
          showTagline={false}
          className="animate-fade-in"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium sidebar-transition group',
                'hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground',
                collapsed && 'justify-center px-0'
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="size-5 flex-shrink-0" />
            {!collapsed && <span className="animate-fade-in">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User & sign out */}
      <div className="p-3 border-t border-border">
        <div className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent cursor-pointer sidebar-transition',
          collapsed && 'justify-center px-0'
        )}>
          <div className="relative flex-shrink-0">
            <div className="size-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
              {getInitials(user?.user_metadata?.full_name ?? user?.email ?? 'U')}
            </div>
            {isDemoUser(user?.id) && (
              <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-amber-400 flex items-center justify-center">
                <Sparkles className="size-2 text-white" />
              </span>
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold truncate">{user?.user_metadata?.full_name ?? 'Profesional'}</p>
                {isDemoUser(user?.id) && (
                  <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1 rounded">DEMO</span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 sidebar-transition mt-1',
            collapsed && 'justify-center px-0'
          )}
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut className="size-4 flex-shrink-0" />
          {!collapsed && <span className="animate-fade-in">Cerrar sesión</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] size-6 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-accent sidebar-transition z-10"
        aria-label={collapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
      >
        {collapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
      </button>
    </aside>
  )
}
