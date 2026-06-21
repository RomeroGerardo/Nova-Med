import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Activity, Droplets, Thermometer, Plus } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import { useVitalsStore } from '@/stores/vitalsStore'
import { DEMO_PATIENT_USER } from '@/lib/demoAuth'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function TrackingPage() {
  const { id: _id } = useParams()
  const { getEntriesForPatient } = useVitalsStore()

  // In demo: always show Ana López's data
  const entries = getEntriesForPatient(DEMO_PATIENT_USER.id)
  const latest = entries[0]

  const chartData = [...entries]
    .reverse()
    .slice(-7)
    .map((e) => ({
      date: format(parseISO(e.recorded_at), 'd/MM'),
      bpm: e.heart_rate,
      spo2: e.oxygen_saturation,
    }))

  const currentBpm = latest?.heart_rate ?? 72
  const currentSpo2 = latest?.oxygen_saturation ?? 98
  const currentBp = latest?.blood_pressure_sys
    ? `${latest.blood_pressure_sys}/${latest.blood_pressure_dia}`
    : '118/78'
  const currentTemp = latest?.temperature ?? 36.5

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/patients/1" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="size-4" /> Ana López
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Seguimiento Clínico</h1>
            <p className="text-sm text-muted-foreground mt-1">Historial de signos vitales · Últimos 7 días</p>
          </div>
          <button
            id="add-vital-record-btn"
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-4" /> Registrar signos vitales
          </button>
        </div>
      </div>

      {/* Current status chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { icon: Heart, label: 'FC Actual', value: `${currentBpm} bpm`, chip: currentBpm > 90 ? 'status-chip-red' : 'status-chip-green' },
          { icon: Activity, label: 'Presión', value: currentBp, chip: 'status-chip-green' },
          { icon: Droplets, label: 'SpO2', value: `${currentSpo2}%`, chip: currentSpo2 < 95 ? 'status-chip-red' : 'status-chip-green' },
          { icon: Thermometer, label: 'Temperatura', value: `${currentTemp}°C`, chip: currentTemp > 37.5 ? 'status-chip-amber' : 'status-chip-green' },
        ].map(v => (
          <div key={v.label} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-premium">
            <v.icon className="size-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">{v.label}</p>
              <p className="data-mono text-sm font-bold text-foreground">{v.value}</p>
            </div>
            <span className={v.chip}>
              <span className="size-1.5 rounded-full bg-current" />
              OK
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">FRECUENCIA CARDÍACA</p>
              <p className="text-lg font-bold text-foreground mt-0.5">72 <span className="text-xs font-normal text-muted-foreground">bpm promedio</span></p>
            </div>
            <Heart className="size-4 text-destructive/70" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v: number) => [`${v} bpm`, 'FC']}
              />
              <ReferenceLine y={90} stroke="hsl(var(--destructive))" strokeDasharray="4 2" strokeWidth={1} />
              <Line type="monotone" dataKey="bpm" stroke="hsl(217 100% 34%)" strokeWidth={2} dot={{ r: 3, fill: 'hsl(217 100% 34%)' }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground mt-2">— Línea roja: umbral de alerta (90 bpm)</p>
        </div>

        {/* SpO2 Chart */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SATURACIÓN DE OXÍGENO (SpO2)</p>
              <p className="text-lg font-bold text-foreground mt-0.5">98% <span className="text-xs font-normal text-muted-foreground">promedio</span></p>
            </div>
            <Droplets className="size-4 text-vt-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis domain={[90, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v: number) => [`${v}%`, 'SpO2']}
              />
              <ReferenceLine y={95} stroke="hsl(var(--destructive))" strokeDasharray="4 2" strokeWidth={1} />
              <Line type="monotone" dataKey="spo2" stroke="hsl(101 61% 45%)" strokeWidth={2} dot={{ r: 3, fill: 'hsl(101 61% 45%)' }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground mt-2">— Línea roja: umbral crítico (&lt;95%)</p>
        </div>
      </div>

      {/* Record History */}
      <div className="metric-card">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">HISTORIAL DE REGISTROS — Cargado por la paciente</p>
        <div className="space-y-4">
          {entries.slice(0, 6).map((record, i) => (
            <div key={record.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="size-3.5 text-primary" />
                </div>
                {i < Math.min(entries.length, 6) - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-2">
                  {format(parseISO(record.recorded_at), "d 'de' MMM yyyy, HH:mm", { locale: es })}
                  <span className="ml-2 text-[10px] bg-secondary/10 text-secondary px-1.5 rounded font-semibold">por paciente</span>
                </p>
                <div className="flex flex-wrap gap-3 mb-2">
                  {record.heart_rate && (
                    <div key="fc" className="bg-muted/50 rounded-lg px-3 py-1.5">
                      <span className="text-[10px] text-muted-foreground">FC: </span>
                      <span className="data-mono text-xs font-semibold text-foreground">{record.heart_rate} bpm</span>
                    </div>
                  )}
                  {record.blood_pressure_sys && (
                    <div key="bp" className="bg-muted/50 rounded-lg px-3 py-1.5">
                      <span className="text-[10px] text-muted-foreground">PA: </span>
                      <span className="data-mono text-xs font-semibold text-foreground">{record.blood_pressure_sys}/{record.blood_pressure_dia}</span>
                    </div>
                  )}
                  {record.oxygen_saturation && (
                    <div key="spo2" className="bg-muted/50 rounded-lg px-3 py-1.5">
                      <span className="text-[10px] text-muted-foreground">SpO2: </span>
                      <span className="data-mono text-xs font-semibold text-foreground">{record.oxygen_saturation}%</span>
                    </div>
                  )}
                  {record.temperature && (
                    <div key="temp" className="bg-muted/50 rounded-lg px-3 py-1.5">
                      <span className="text-[10px] text-muted-foreground">Temp: </span>
                      <span className="data-mono text-xs font-semibold text-foreground">{record.temperature}°C</span>
                    </div>
                  )}
                </div>
                {record.notes && (
                  <p className="text-xs text-muted-foreground leading-relaxed italic">"{record.notes}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
