import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, UserPlus, Filter, MoreHorizontal, Heart, Activity } from 'lucide-react'

const patients = [
  { id: '1', name: 'Ana López', age: 54, specialty: 'Cardiología', status: 'stable', bpm: 72, spo2: 98, lastVisit: '10/06/2026', avatar: 'AL' },
  { id: '2', name: 'Carlos Ruiz', age: 67, specialty: 'Endocrinología', status: 'alert', bpm: 95, spo2: 96, lastVisit: '09/06/2026', avatar: 'CR' },
  { id: '3', name: 'María Torres', age: 42, specialty: 'Medicina General', status: 'stable', bpm: 68, spo2: 99, lastVisit: '08/06/2026', avatar: 'MT' },
  { id: '4', name: 'Juan Pérez', age: 71, specialty: 'Nefrología', status: 'critical', bpm: 110, spo2: 94, lastVisit: '10/06/2026', avatar: 'JP' },
  { id: '5', name: 'Sofía Martínez', age: 38, specialty: 'Medicina General', status: 'stable', bpm: 75, spo2: 98, lastVisit: '07/06/2026', avatar: 'SM' },
  { id: '6', name: 'Roberto Díaz', age: 60, specialty: 'Cardiología', status: 'stable', bpm: 69, spo2: 97, lastVisit: '06/06/2026', avatar: 'RD' },
]

const statusConfig: Record<string, { chip: string; label: string }> = {
  stable: { chip: 'status-chip-green', label: 'Estable' },
  alert: { chip: 'status-chip-amber', label: 'Alerta' },
  critical: { chip: 'status-chip-red', label: 'Crítico' },
}

export function PatientsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'stable' | 'alert' | 'critical'>('all')

  const filtered = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || p.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Pacientes</h1>
          <p className="text-sm text-muted-foreground mt-1">{patients.length} pacientes registrados · {patients.filter(p => p.status !== 'stable').length} con alertas</p>
        </div>
        <button
          id="add-patient-btn"
          className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="size-4" /> Agregar paciente
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            id="patients-search"
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          {(['all', 'stable', 'alert', 'critical'] as const).map(f => (
            <button
              key={f}
              id={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'stable' ? 'Estables' : f === 'alert' ? 'Alertas' : 'Críticos'}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {['Paciente', 'Especialidad', 'Estado', 'FC (bpm)', 'SpO2', 'Última visita', ''].map(col => (
                  <th key={col} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3.5">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(patient => (
                <tr key={patient.id} className="hover:bg-accent/40 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                        {patient.avatar}
                      </div>
                      <div>
                        <Link to={`/patients/${patient.id}`} className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {patient.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{patient.age} años</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{patient.specialty}</td>
                  <td className="px-5 py-4">
                    <span className={statusConfig[patient.status].chip}>
                      <span className="size-1.5 rounded-full bg-current" />
                      {statusConfig[patient.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Heart className="size-3.5 text-destructive/70" />
                      <span className="data-mono text-sm font-semibold text-foreground">{patient.bpm}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Activity className="size-3.5 text-primary/70" />
                      <span className="data-mono text-sm font-semibold text-foreground">{patient.spo2}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{patient.lastVisit}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/patients/${patient.id}/tracking`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Seguimiento
                      </Link>
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No se encontraron pacientes con ese criterio.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
