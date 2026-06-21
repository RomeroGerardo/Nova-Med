import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scale, Ruler, Moon, Droplet, Dumbbell, Smile, ArrowLeft, CheckCircle2, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { useLifestyleStore } from '@/stores/lifestyleStore'
import { DEMO_PATIENT_USER } from '@/lib/demoAuth'
import type { ExerciseType } from '@/types'

export function LogLifestylePage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addEntry, getGoalsForPatient } = useLifestyleStore()
  
  const patientId = user?.id || DEMO_PATIENT_USER.id
  const goals = getGoalsForPatient(patientId)

  // Local state for the lifestyle form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [weight, setWeight] = useState('')
  const [waist, setWaist] = useState('')
  const [sleepHours, setSleepHours] = useState('')
  const [waterGlasses, setWaterGlasses] = useState('')
  const [exerciseMinutes, setExerciseMinutes] = useState('')
  const [exerciseType, setExerciseType] = useState<ExerciseType>('walking')
  const [mood, setMood] = useState<number>(4)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const entry = {
        patient_id: patientId,
        recorded_at: date,
        weight: weight ? parseFloat(weight) : undefined,
        waist: waist ? parseFloat(waist) : undefined,
        sleep_hours: sleepHours ? parseFloat(sleepHours) : undefined,
        water_glasses: waterGlasses ? parseInt(waterGlasses, 10) : undefined,
        exercise_minutes: exerciseMinutes ? parseInt(exerciseMinutes, 10) : undefined,
        exercise_type: exerciseMinutes ? exerciseType : undefined,
        mood: mood as 1 | 2 | 3 | 4 | 5,
        notes: notes || undefined,
      }

      // Add to store
      addEntry(entry)
      
      toast.success('Hábitos registrados correctamente 🌟')
      navigate('/patient/lifestyle')
    } catch (error) {
      toast.error('Error al registrar hábitos')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Registrar Hábitos Diarios</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Control de peso, agua, sueño y ejercicio.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Selector */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="size-3.5 text-primary" />
            Fecha de Registro
          </label>
          <input
            type="date"
            value={date}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        {/* Weight and Waist */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="size-3.5 text-amber-500" />
              Peso (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                placeholder="Ej: 65.2"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full h-10 pl-3 pr-10 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">kg</span>
            </div>
            {goals.target_weight && (
              <p className="text-[10px] text-muted-foreground text-center">
                Meta: <span className="font-semibold">{goals.target_weight} kg</span>
              </p>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Ruler className="size-3.5 text-blue-500" />
              Cintura (cm)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                placeholder="Ej: 78"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="w-full h-10 pl-3 pr-10 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">cm</span>
            </div>
            {goals.target_waist && (
              <p className="text-[10px] text-muted-foreground text-center">
                Meta: <span className="font-semibold">{goals.target_waist} cm</span>
              </p>
            )}
          </div>
        </div>

        {/* Water and Sleep */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Droplet className="size-3.5 text-sky-500" />
              Agua (vasos)
            </label>
            <div className="flex items-center gap-2 justify-center py-1">
              <button
                type="button"
                onClick={() => setWaterGlasses(prev => Math.max(0, parseInt(prev || '0', 10) - 1).toString())}
                className="size-8 rounded-full border border-border flex items-center justify-center font-bold text-lg text-muted-foreground hover:bg-muted"
              >
                -
              </button>
              <input
                type="number"
                placeholder="0"
                value={waterGlasses}
                onChange={(e) => setWaterGlasses(e.target.value)}
                className="w-12 h-10 rounded-lg border border-border bg-background text-center text-sm text-foreground font-bold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setWaterGlasses(prev => (parseInt(prev || '0', 10) + 1).toString())}
                className="size-8 rounded-full border border-border flex items-center justify-center font-bold text-lg text-muted-foreground hover:bg-muted"
              >
                +
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Meta: <span className="font-semibold">{goals.daily_water_glasses} vasos</span> (2L)
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Moon className="size-3.5 text-indigo-500" />
              Sueño (horas)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                placeholder="Ej: 7.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-full h-10 pl-3 pr-10 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">hs</span>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Meta: <span className="font-semibold">{goals.sleep_goal_hours} horas</span>
            </p>
          </div>
        </div>

        {/* Exercise Section */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Dumbbell className="size-3.5 text-emerald-500" />
            Ejercicio Físico
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Duración</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Minutos"
                  value={exerciseMinutes}
                  onChange={(e) => setExerciseMinutes(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">min</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Tipo de Actividad</label>
              <select
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value as ExerciseType)}
                className="w-full h-10 px-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="walking">Caminar</option>
                <option value="running">Trotar / Correr</option>
                <option value="cycling">Ciclismo</option>
                <option value="swimming">Natación</option>
                <option value="yoga">Yoga / Pilates</option>
                <option value="gym">Gimnasio</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mood/Energy */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Smile className="size-3.5 text-purple-500" />
            Estado de ánimo / Energía
          </label>
          <div className="flex justify-between items-center px-1">
            {[1, 2, 3, 4, 5].map((val) => {
              const icons = ['😢', '😕', '😐', '🙂', '🤩']
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMood(val)}
                  className={`size-11 rounded-xl flex items-center justify-center text-xl transition-all border ${
                    mood === val ? 'bg-primary/10 border-primary scale-110 shadow-sm' : 'bg-transparent border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {icons[val - 1]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notas u observaciones</label>
          <textarea
            rows={2}
            placeholder="¿Cómo te sentiste hoy? Ej: Sin fatiga, buena energía..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-primary/10"
        >
          <CheckCircle2 className="size-4" />
          {isSubmitting ? 'Guardando...' : 'Guardar hábitos de hoy'}
        </button>
      </form>
    </div>
  )
}
