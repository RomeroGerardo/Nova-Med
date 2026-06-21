import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Activity, Droplets, Thermometer, Scale, Candy, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useVitalsStore } from '@/stores/vitalsStore'
import { DEMO_PATIENT_USER } from '@/lib/demoAuth'

interface VitalField {
  key: string
  label: string
  unit: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  placeholder: string
  min: number
  max: number
  step: number
  normalMin?: number
  normalMax?: number
  hint: string
  row1?: string
  row2?: string
}

const vitalFields: VitalField[] = [
  {
    key: 'heart_rate',
    label: 'Frecuencia Cardíaca',
    unit: 'bpm',
    icon: Heart,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    placeholder: 'ej: 72',
    min: 30,
    max: 220,
    step: 1,
    normalMin: 60,
    normalMax: 100,
    hint: 'Normal: 60–100 bpm',
  },
  {
    key: 'blood_pressure',
    label: 'Presión Arterial',
    unit: 'mmHg',
    icon: Activity,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/5',
    placeholder: 'ej: 120 / 80',
    min: 0,
    max: 0,
    step: 1,
    normalMin: 90,
    normalMax: 140,
    hint: 'Normal: 90–140 / 60–90 mmHg',
    row1: 'Sistólica',
    row2: 'Diastólica',
  },
  {
    key: 'oxygen_saturation',
    label: 'Saturación de Oxígeno (SpO2)',
    unit: '%',
    icon: Droplets,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    placeholder: 'ej: 98',
    min: 70,
    max: 100,
    step: 1,
    normalMin: 95,
    normalMax: 100,
    hint: 'Normal: 95–100%',
  },
  {
    key: 'temperature',
    label: 'Temperatura Corporal',
    unit: '°C',
    icon: Thermometer,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    placeholder: 'ej: 36.5',
    min: 34,
    max: 42,
    step: 0.1,
    normalMin: 36.0,
    normalMax: 37.5,
    hint: 'Normal: 36.0–37.5°C',
  },
  {
    key: 'weight',
    label: 'Peso',
    unit: 'kg',
    icon: Scale,
    iconColor: 'text-secondary',
    iconBg: 'bg-secondary/10',
    placeholder: 'ej: 65.5',
    min: 20,
    max: 300,
    step: 0.1,
    hint: 'Opcional',
  },
  {
    key: 'glucose',
    label: 'Glucemia (Glucosa)',
    unit: 'mg/dL',
    icon: Candy,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50',
    placeholder: 'ej: 95',
    min: 40,
    max: 600,
    step: 1,
    normalMin: 70,
    normalMax: 140,
    hint: 'Normal en ayunas: 70–100 mg/dL',
  },
]

function getWarning(key: string, value: number, field: VitalField): string | null {
  if (!field.normalMin || !field.normalMax) return null
  if (value < field.normalMin) return `⚠️ Valor bajo. Lo normal es ${field.hint}`
  if (value > field.normalMax) return `⚠️ Valor alto. Lo normal es ${field.hint}`
  return null
}

export function LogVitalsPage() {
  const navigate = useNavigate()
  const { addEntry } = useVitalsStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [values, setValues] = useState<Record<string, string>>({
    heart_rate: '',
    blood_pressure_sys: '',
    blood_pressure_dia: '',
    oxygen_saturation: '',
    temperature: '',
    weight: '',
    glucose: '',
    notes: '',
  })

  const set = (key: string, val: string) =>
    setValues((prev) => ({ ...prev, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const hr = values.heart_rate ? Number(values.heart_rate) : undefined
    const spo2 = values.oxygen_saturation ? Number(values.oxygen_saturation) : undefined
    const temp = values.temperature ? Number(values.temperature) : undefined
    const weight = values.weight ? Number(values.weight) : undefined
    const glucose = values.glucose ? Number(values.glucose) : undefined
    const bpSys = values.blood_pressure_sys ? Number(values.blood_pressure_sys) : undefined
    const bpDia = values.blood_pressure_dia ? Number(values.blood_pressure_dia) : undefined

    if (!hr && !spo2 && !temp && !weight && !glucose && !bpSys) {
      toast.error('Ingresá al menos un valor para guardar.')
      return
    }

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 900)) // simulate save

    addEntry({
      patient_id: DEMO_PATIENT_USER.id,
      heart_rate: hr,
      blood_pressure_sys: bpSys,
      blood_pressure_dia: bpDia,
      oxygen_saturation: spo2,
      temperature: temp,
      weight: weight,
      glucose: glucose,
      notes: values.notes || undefined,
      recorded_by: 'patient',
    })

    setSubmitted(true)
    setIsSubmitting(false)

    toast.success('¡Signos vitales guardados! ✅', {
      description: 'Tu profesional ya puede verlos.',
    })

    setTimeout(() => navigate('/patient/dashboard'), 1800)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center animate-fade-in">
        <div className="size-16 rounded-full bg-secondary/15 flex items-center justify-center">
          <CheckCircle2 className="size-8 text-secondary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">¡Registro guardado!</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Tus signos vitales fueron enviados correctamente. Tu médico podrá verlos en su próxima revisión.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/patient/dashboard')}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="size-4" /> Volver
        </button>
        <h1 className="text-xl font-bold text-foreground">Registrar mis signos vitales</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Completá los valores disponibles. No es obligatorio llenar todos los campos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Heart rate */}
        {vitalFields.filter((f) => f.key !== 'blood_pressure').map((field) => {
          const val = values[field.key]
          const numVal = val ? Number(val) : undefined
          const warning = numVal !== undefined ? getWarning(field.key, numVal, field) : null

          return (
            <div key={field.key} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`size-8 ${field.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <field.icon className={`size-4 ${field.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{field.label}</p>
                  <p className="text-[11px] text-muted-foreground">{field.hint}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id={`vital-${field.key}`}
                  type="number"
                  min={field.min || undefined}
                  max={field.max || undefined}
                  step={field.step}
                  value={val}
                  onChange={(e) => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors data-mono"
                />
                <span className="text-sm text-muted-foreground font-medium min-w-[40px]">{field.unit}</span>
              </div>
              {warning && (
                <div className="flex items-center gap-1.5 mt-2 text-amber-600">
                  <AlertTriangle className="size-3.5 flex-shrink-0" />
                  <p className="text-[11px]">{warning}</p>
                </div>
              )}
            </div>
          )
        })}

        {/* Blood pressure — two fields */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-8 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Presión Arterial</p>
              <p className="text-[11px] text-muted-foreground">Normal: 90–140 / 60–90 mmHg</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="vital-bp-sys" className="text-[11px] text-muted-foreground mb-1 block">Sistólica</label>
              <div className="flex items-center gap-1.5">
                <input
                  id="vital-bp-sys"
                  type="number"
                  min={60}
                  max={250}
                  value={values.blood_pressure_sys}
                  onChange={(e) => set('blood_pressure_sys', e.target.value)}
                  placeholder="120"
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors data-mono"
                />
                <span className="text-xs text-muted-foreground">mmHg</span>
              </div>
            </div>
            <div>
              <label htmlFor="vital-bp-dia" className="text-[11px] text-muted-foreground mb-1 block">Diastólica</label>
              <div className="flex items-center gap-1.5">
                <input
                  id="vital-bp-dia"
                  type="number"
                  min={40}
                  max={150}
                  value={values.blood_pressure_dia}
                  onChange={(e) => set('blood_pressure_dia', e.target.value)}
                  placeholder="80"
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors data-mono"
                />
                <span className="text-xs text-muted-foreground">mmHg</span>
              </div>
            </div>
          </div>
          {values.blood_pressure_sys && Number(values.blood_pressure_sys) > 140 && (
            <div className="flex items-center gap-1.5 mt-2 text-amber-600">
              <AlertTriangle className="size-3.5" />
              <p className="text-[11px]">⚠️ Presión sistólica elevada. Informá a tu médico.</p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-xl p-4">
          <label htmlFor="vital-notes" className="text-sm font-semibold text-foreground block mb-1">
            ¿Cómo te sentís hoy?
          </label>
          <p className="text-[11px] text-muted-foreground mb-2">Opcional — comentá si notás algo inusual.</p>
          <textarea
            id="vital-notes"
            rows={3}
            value={values.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="ej: Me siento bien, tuve dolor de cabeza leve..."
            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <button
          id="submit-vitals-btn"
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
        >
          {isSubmitting ? (
            <>
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" />
              Guardar mis signos vitales
            </>
          )}
        </button>
        <div className="h-2" />
      </form>
    </div>
  )
}
