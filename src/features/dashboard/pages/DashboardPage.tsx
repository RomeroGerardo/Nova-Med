import { Users, CalendarCheck, AlertTriangle, Heart, Activity, Droplets, TrendingUp, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for portfolio demonstration
const mockHeartRateData = [
  { time: '06:00', bpm: 68 }, { time: '08:00', bpm: 72 }, { time: '10:00', bpm: 75 },
  { time: '12:00', bpm: 80 }, { time: '14:00', bpm: 77 }, { time: '16:00', bpm: 73 },
  { time: '18:00', bpm: 70 }, { time: '20:00', bpm: 69 },
]

const recentPatients = [
  { id: '1', name: 'Ana López', status: 'stable', lastVital: '72 bpm', time: 'hace 5 min', avatar: 'AL' },
  { id: '2', name: 'Carlos Ruiz', status: 'alert', lastVital: '95 bpm', time: 'hace 12 min', avatar: 'CR' },
  { id: '3', name: 'María Torres', status: 'stable', lastVital: '68 bpm', time: 'hace 20 min', avatar: 'MT' },
  { id: '4', name: 'Juan Pérez', status: 'critical', lastVital: '110 bpm', time: 'hace 1 h', avatar: 'JP' },
]

const statusColor: Record<string, string> = {
  stable: 'status-chip-green',
  alert: 'status-chip-amber',
  critical: 'status-chip-red',
}
const statusLabel: Record<string, string> = {
  stable: 'Estable',
  alert: 'Alerta',
  critical: 'Crítico',
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const name = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Profesional'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Buenos días, {name} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Aquí está el resumen de salud de tus pacientes hoy.</p>
        </div>
        <Link
          to="/patients"
          className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Users className="size-4" /> Ver pacientes
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Pacientes', value: '48', icon: Users, trend: '+3', up: true, color: 'text-primary' },
          { label: 'Citas Hoy', value: '7', icon: CalendarCheck, trend: '2 completadas', up: true, color: 'text-secondary' },
          { label: 'Alertas Activas', value: '2', icon: AlertTriangle, trend: '1 crítica', up: false, color: 'text-destructive' },
          { label: 'Promedio SpO2', value: '97.4%', icon: Droplets, trend: '+0.3%', up: true, color: 'text-vt-blue-500' },
        ].map(({ label, value, icon: Icon, trend, up, color }) => (
          <div key={label} className="metric-card">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
              <Icon className={`size-4 ${color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
            <div className={`flex items-center gap-1 text-xs ${up ? 'text-secondary' : 'text-destructive'}`}>
              {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              <span>{trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heart Rate Chart */}
        <div className="lg:col-span-2 metric-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">FRECUENCIA CARDÍACA PROMEDIO</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">73 <span className="text-sm font-normal text-muted-foreground">bpm</span></p>
            </div>
            <div className="status-chip-green">
              <span className="size-1.5 rounded-full bg-current" />
              Rango Normal
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mockHeartRateData}>
              <defs>
                <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217 100% 34%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(217 100% 34%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v: number) => [`${v} bpm`, 'Frec. Cardíaca']}
              />
              <Area type="monotone" dataKey="bpm" stroke="hsl(217 100% 34%)" strokeWidth={2} fill="url(#heartGradient)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Vital Alerts */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ALERTAS VITALES</p>
            <AlertTriangle className="size-4 text-destructive" />
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="size-3.5 text-destructive" />
                <span className="text-xs font-semibold text-destructive">CRÍTICO</span>
              </div>
              <p className="text-sm font-medium text-foreground">Juan Pérez</p>
              <p className="text-xs text-muted-foreground">FC: 110 bpm — Supera umbral</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="size-3.5 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">ALERTA</span>
              </div>
              <p className="text-sm font-medium text-foreground">Carlos Ruiz</p>
              <p className="text-xs text-muted-foreground">FC: 95 bpm — Cerca del umbral</p>
            </div>
            <Link to="/patients" className="block text-center text-xs text-primary hover:underline mt-2">
              Ver todas las alertas →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PACIENTES RECIENTES</p>
          <Link to="/patients" className="text-xs text-primary hover:underline">Ver todos</Link>
        </div>
        <div className="divide-y divide-border">
          {recentPatients.map(patient => (
            <Link
              key={patient.id}
              to={`/patients/${patient.id}`}
              className="flex items-center gap-4 py-3 hover:bg-accent/50 -mx-5 px-5 rounded-lg transition-colors group"
            >
              <div className="size-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {patient.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{patient.name}</p>
                <p className="text-xs text-muted-foreground">{patient.time}</p>
              </div>
              <div className="text-right">
                <p className="data-mono text-sm font-semibold text-foreground">{patient.lastVital}</p>
                <span className={statusColor[patient.status]}>{statusLabel[patient.status]}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
