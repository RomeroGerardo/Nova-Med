import { Link } from 'react-router-dom'
import { Heart, Activity, Droplets, Thermometer, Scale, Candy, Plus, ChevronRight, Stethoscope, CheckCircle2, Clock } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useVitalsStore } from '@/stores/vitalsStore'
import { DEMO_PATIENT_USER } from '@/lib/demoAuth'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function formatDate(iso: string) {
  try {
    return format(parseISO(iso), "d 'de' MMM, HH:mm", { locale: es })
  } catch {
    return iso
  }
}

function VitalBadge({ value, unit, normal }: { value?: number; unit: string; normal?: boolean }) {
  if (value === undefined) return <span className="text-muted-foreground text-sm">—</span>
  return (
    <span className={`data-mono font-bold text-sm ${normal === false ? 'text-destructive' : 'text-foreground'}`}>
      {value} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
    </span>
  )
}

export function PatientDashboardPage() {
  const { user } = useAuthStore()
  const { getEntriesForPatient, getLatestForPatient } = useVitalsStore()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Paciente'
  const professionalName = user?.user_metadata?.professional_name ?? 'tu profesional'

  const patientId = DEMO_PATIENT_USER.id
  const latest = getLatestForPatient(patientId)
  const allEntries = getEntriesForPatient(patientId)
  const recentEntries = allEntries.slice(0, 5)

  // Chart data — last 7 entries for FC trend
  const chartData = [...allEntries]
    .reverse()
    .slice(-7)
    .map((e) => ({
      date: format(parseISO(e.recorded_at), 'd/MM'),
      bpm: e.heart_rate,
    }))
    .filter((d) => d.bpm !== undefined)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-foreground">{greeting}, {firstName} 👋</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Llevá un registro diario de tu salud para que {professionalName} pueda monitorearte.
        </p>
      </div>

      {/* Professional connection card */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-primary/5 border border-primary/20">
        <div className="size-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Stethoscope className="size-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground">{professionalName}</p>
          <p className="text-[11px] text-muted-foreground">Cardiología · Clínica del Sur</p>
        </div>
        <div className="flex items-center gap-1.5 text-secondary">
          <span className="size-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="text-[10px] font-semibold">Conectado</span>
        </div>
      </div>

      {/* CTA — Log vitals */}
      <Link
        to="/patient/log-vitals"
        id="log-vitals-cta"
        className="flex items-center justify-between w-full p-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
      >
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Plus className="size-5" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm">Registrar signos vitales</p>
            <p className="text-[11px] text-primary-foreground/70">
              {latest ? `Último: ${formatDate(latest.recorded_at)}` : 'Aún no registraste ninguno'}
            </p>
          </div>
        </div>
        <ChevronRight className="size-5 text-primary-foreground/70" />
      </Link>

      {/* Latest vitals cards */}
      {latest && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Último Registro</p>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-3" />
              <span className="text-[10px]">{formatDate(latest.recorded_at)}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: Heart, label: 'FC', value: latest.heart_rate, unit: 'bpm', color: 'text-red-500', bg: 'bg-red-50' },
              { icon: Activity, label: 'Presión', value: latest.blood_pressure_sys ? `${latest.blood_pressure_sys}/${latest.blood_pressure_dia}` : undefined, unit: 'mmHg', color: 'text-primary', bg: 'bg-primary/5' },
              { icon: Droplets, label: 'SpO2', value: latest.oxygen_saturation, unit: '%', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: Thermometer, label: 'Temp.', value: latest.temperature, unit: '°C', color: 'text-amber-500', bg: 'bg-amber-50' },
              { icon: Scale, label: 'Peso', value: latest.weight, unit: 'kg', color: 'text-secondary', bg: 'bg-secondary/10' },
              { icon: Candy, label: 'Glucosa', value: latest.glucose, unit: 'mg/dL', color: 'text-purple-500', bg: 'bg-purple-50' },
            ].map(({ icon: Icon, label, value, unit, color, bg }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-3 flex flex-col gap-1.5">
                <div className={`size-7 ${bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`size-3.5 ${color}`} />
                </div>
                <p className="text-[10px] text-muted-foreground">{label}</p>
                {typeof value === 'number' ? (
                  <VitalBadge value={value} unit={unit} />
                ) : typeof value === 'string' ? (
                  <span className="data-mono font-bold text-sm text-foreground">{value} <span className="text-xs font-normal text-muted-foreground">{unit}</span></span>
                ) : (
                  <span className="text-muted-foreground text-sm font-medium">—</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FC trend chart */}
      {chartData.length > 1 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tendencia FC</p>
              <p className="text-sm font-bold text-foreground mt-0.5">
                {latest?.heart_rate ?? '—'} <span className="text-xs font-normal text-muted-foreground">bpm último</span>
              </p>
            </div>
            <Heart className="size-4 text-red-400" />
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="patientFCGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217 100% 34%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(217 100% 34%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }}
                formatter={(v: number) => [`${v} bpm`, 'FC']}
              />
              <Area type="monotone" dataKey="bpm" stroke="hsl(217 100% 34%)" strokeWidth={2} fill="url(#patientFCGradient)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent history */}
      {recentEntries.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Historial Reciente</p>
          <div className="space-y-2">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 p-3 bg-card border border-border rounded-xl">
                <div className="size-7 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="size-3.5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground mb-1">{formatDate(entry.recorded_at)}</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.heart_rate && (
                      <span className="text-[10px] bg-muted rounded px-2 py-0.5">
                        <span className="text-muted-foreground">FC: </span>
                        <span className="font-semibold text-foreground">{entry.heart_rate} bpm</span>
                      </span>
                    )}
                    {entry.blood_pressure_sys && (
                      <span className="text-[10px] bg-muted rounded px-2 py-0.5">
                        <span className="text-muted-foreground">PA: </span>
                        <span className="font-semibold text-foreground">{entry.blood_pressure_sys}/{entry.blood_pressure_dia}</span>
                      </span>
                    )}
                    {entry.oxygen_saturation && (
                      <span className="text-[10px] bg-muted rounded px-2 py-0.5">
                        <span className="text-muted-foreground">SpO2: </span>
                        <span className="font-semibold text-foreground">{entry.oxygen_saturation}%</span>
                      </span>
                    )}
                    {entry.temperature && (
                      <span className="text-[10px] bg-muted rounded px-2 py-0.5">
                        <span className="text-muted-foreground">Temp: </span>
                        <span className="font-semibold text-foreground">{entry.temperature}°C</span>
                      </span>
                    )}
                  </div>
                  {entry.notes && (
                    <p className="text-[11px] text-muted-foreground mt-1 italic">"{entry.notes}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-4" /> {/* bottom spacer */}
    </div>
  )
}
