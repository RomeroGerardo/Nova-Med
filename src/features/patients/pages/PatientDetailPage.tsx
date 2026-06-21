import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Activity, Thermometer, Droplets, Scale, ChevronRight } from 'lucide-react'

// Mock patient detail
const mockPatient = {
  id: '1', name: 'Ana López', age: 54, gender: 'Femenino', status: 'stable',
  specialty: 'Cardiología', clinic: 'Clínica del Sur',
  email: 'ana.lopez@email.com', phone: '+54 11 1234-5678',
  record_number: 'VT-2026-0001',
  notes: 'Paciente con hipertensión controlada. Sin alergias conocidas. Medicación: Atenolol 50mg/día.',
  vitals: { bpm: 72, spo2: 98, temp: 36.6, weight: 65.5, bp: '120/80' },
  lastVisit: '10/06/2026',
}

export function PatientDetailPage() {
  const { id: _id } = useParams()

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link to="/patients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="size-4" /> Volver a Pacientes
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-primary/15 flex items-center justify-center text-lg font-bold text-primary">
              AL
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{mockPatient.name}</h1>
              <p className="text-sm text-muted-foreground">{mockPatient.age} años · {mockPatient.gender} · N° {mockPatient.record_number}</p>
            </div>
          </div>
          <Link
            to={`/patients/${mockPatient.id}/tracking`}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ver Seguimiento <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Current Vitals */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">SIGNOS VITALES ACTUALES</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { icon: Heart, label: 'Frec. Cardíaca', value: `${mockPatient.vitals.bpm}`, unit: 'bpm', color: 'text-red-500', bg: 'bg-red-50' },
            { icon: Activity, label: 'Presión Arterial', value: mockPatient.vitals.bp, unit: 'mmHg', color: 'text-primary', bg: 'bg-vt-blue-50' },
            { icon: Droplets, label: 'SpO2', value: `${mockPatient.vitals.spo2}`, unit: '%', color: 'text-vt-blue-500', bg: 'bg-vt-blue-50' },
            { icon: Thermometer, label: 'Temperatura', value: `${mockPatient.vitals.temp}`, unit: '°C', color: 'text-amber-500', bg: 'bg-amber-50' },
            { icon: Scale, label: 'Peso', value: `${mockPatient.vitals.weight}`, unit: 'kg', color: 'text-secondary', bg: 'bg-vt-green-50' },
          ].map(v => (
            <div key={v.label} className="metric-card">
              <div className={`size-8 ${v.bg} rounded-lg flex items-center justify-center mb-3`}>
                <v.icon className={`size-4 ${v.color}`} />
              </div>
              <p className="text-xs text-muted-foreground mb-0.5">{v.label}</p>
              <p className="text-xl font-bold text-foreground">
                <span className="data-mono">{v.value}</span>
                <span className="text-xs font-normal text-muted-foreground ml-1">{v.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="metric-card">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">INFORMACIÓN DE CONTACTO</p>
          <div className="space-y-3">
            {[
              { label: 'Email', value: mockPatient.email },
              { label: 'Teléfono', value: mockPatient.phone },
              { label: 'Especialidad', value: mockPatient.specialty },
              { label: 'Clínica', value: mockPatient.clinic },
              { label: 'Última visita', value: mockPatient.lastVisit },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="metric-card">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">NOTAS CLÍNICAS</p>
          <p className="text-sm text-foreground leading-relaxed">{mockPatient.notes}</p>
          <button className="mt-4 text-xs text-primary hover:underline">Editar notas</button>
        </div>
      </div>
    </div>
  )
}
