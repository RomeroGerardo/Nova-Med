import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Scale,
  Ruler,
  Moon,
  Droplet,
  Dumbbell,
  Plus,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Calendar,
  Settings2,
  Check,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useLifestyleStore } from '@/stores/lifestyleStore'
import { DEMO_PATIENT_USER } from '@/lib/demoAuth'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

export function LifestyleDashboardPage() {
  const { user } = useAuthStore()
  const { getEntriesForPatient, getGoalsForPatient, updateGoalsForPatient } = useLifestyleStore()
  
  const patientId = user?.id || DEMO_PATIENT_USER.id
  const goals = getGoalsForPatient(patientId)
  const entries = getEntriesForPatient(patientId)

  // Edit Goals State
  const [isEditingGoals, setIsEditingGoals] = useState(false)
  const [targetWeight, setTargetWeight] = useState(goals.target_weight?.toString() || '')
  const [targetWaist, setTargetWaist] = useState(goals.target_waist?.toString() || '')
  const [waterGoal, setWaterGoal] = useState(goals.daily_water_glasses.toString())
  const [sleepGoal, setSleepGoal] = useState(goals.sleep_goal_hours.toString())
  const [exerciseGoal, setExerciseGoal] = useState(goals.exercise_days_per_week.toString())

  // Calculate adherence for the last 7 entries
  const last7Entries = entries.slice(0, 7)
  
  let totalAdherencePoints = 0
  let totalPossiblePoints = 0

  last7Entries.forEach(entry => {
    // Water adherence
    if (entry.water_glasses !== undefined) {
      totalPossiblePoints += 1
      if (entry.water_glasses >= goals.daily_water_glasses) {
        totalAdherencePoints += 1
      } else {
        totalAdherencePoints += (entry.water_glasses / goals.daily_water_glasses)
      }
    }

    // Sleep adherence
    if (entry.sleep_hours !== undefined) {
      totalPossiblePoints += 1
      if (entry.sleep_hours >= goals.sleep_goal_hours) {
        totalAdherencePoints += 1
      } else {
        totalAdherencePoints += (entry.sleep_hours / goals.sleep_goal_hours)
      }
    }

    // Exercise adherence (per entry basis - did they log any exercise?)
    if (entry.exercise_minutes !== undefined) {
      totalPossiblePoints += 0.5
      if (entry.exercise_minutes >= 30) {
        totalAdherencePoints += 0.5
      } else if (entry.exercise_minutes > 0) {
        totalAdherencePoints += 0.25
      }
    }
  })

  // Exercise days per week check
  const last7DaysCount = entries.slice(0, 7).filter(e => e.exercise_minutes && e.exercise_minutes > 0).length
  const exerciseAdherenceRate = Math.min(1, last7DaysCount / goals.exercise_days_per_week)
  
  totalPossiblePoints += 2
  totalAdherencePoints += (exerciseAdherenceRate * 2)

  const finalAdherencePct = totalPossiblePoints > 0 
    ? Math.round((totalAdherencePoints / totalPossiblePoints) * 100) 
    : 85 // Fallback seed

  // Calculate weight trend and predictions using linear regression if possible, or simple slope
  const weightEntries = [...entries]
    .filter(e => e.weight !== undefined)
    .reverse() // Chronological order

  let weightChangeRatePerDay = 0
  let predictedDaysToGoal = null
  let predictionMessage = ''
  let currentWeight = entries[0]?.weight || 65.1
  let currentWaist = entries[0]?.waist || 77.5

  if (weightEntries.length >= 3) {
    const firstWeight = weightEntries[0].weight!
    const lastWeight = weightEntries[weightEntries.length - 1].weight!
    const firstDate = new Date(weightEntries[0].recorded_at).getTime()
    const lastDate = new Date(weightEntries[weightEntries.length - 1].recorded_at).getTime()
    const daysDiff = (lastDate - firstDate) / (1000 * 60 * 60 * 24)

    if (daysDiff > 0) {
      weightChangeRatePerDay = (lastWeight - firstWeight) / daysDiff
    }

    if (goals.target_weight && weightChangeRatePerDay < 0 && currentWeight > goals.target_weight) {
      const remainingWeight = currentWeight - goals.target_weight
      predictedDaysToGoal = Math.round(remainingWeight / Math.abs(weightChangeRatePerDay))
      predictionMessage = `Siguiendo tu ritmo de descenso de ${(Math.abs(weightChangeRatePerDay) * 7).toFixed(2)} kg por semana, alcanzarás tu meta de ${goals.target_weight} kg en aproximadamente ${predictedDaysToGoal} días.`
    } else if (goals.target_weight && currentWeight <= goals.target_weight) {
      predictionMessage = '¡Felicidades! Has alcanzado tu peso meta. Mantén tus hábitos para sostenerlo.'
    } else if (goals.target_weight && weightChangeRatePerDay >= 0) {
      predictionMessage = 'Mantén tu constancia con el ejercicio y el agua para activar tu metabolismo y ver cambios de peso.'
    }
  } else {
    // Default prediction based on standard healthy rate
    predictionMessage = 'Registra tu peso unos días más para calcular tu tasa de progreso y estimación de meta.'
  }

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault()
    updateGoalsForPatient(patientId, {
      target_weight: targetWeight ? parseFloat(targetWeight) : undefined,
      target_waist: targetWaist ? parseFloat(targetWaist) : undefined,
      daily_water_glasses: parseInt(waterGoal, 10),
      sleep_goal_hours: parseFloat(sleepGoal),
      exercise_days_per_week: parseInt(exerciseGoal, 10),
    })
    setIsEditingGoals(false)
    toast.success('Metas de hábitos actualizadas 🎯')
  }

  // Chart data
  const chartData = [...entries]
    .reverse()
    .slice(-10)
    .map(e => ({
      date: format(parseISO(e.recorded_at + 'T12:00:00.000Z'), 'd/MM', { locale: es }),
      peso: e.weight,
      cintura: e.waist,
    }))

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Mis Hábitos y Progreso</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Monitoreo de hábitos y predicciones de metas.</p>
        </div>
        <button
          onClick={() => setIsEditingGoals(!isEditingGoals)}
          className="size-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings2 className="size-4.5" />
        </button>
      </div>

      {/* Edit Goals Card */}
      {isEditingGoals && (
        <form onSubmit={handleSaveGoals} className="bg-card border border-primary/20 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Settings2 className="size-4 text-primary" />
              Editar mis Metas
            </h3>
            <button
              type="button"
              onClick={() => setIsEditingGoals(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Peso Meta (kg)</label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={e => setTargetWeight(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Cintura Meta (cm)</label>
              <input
                type="number"
                step="0.5"
                value={targetWaist}
                onChange={e => setTargetWaist(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Vasos de Agua/Día</label>
              <input
                type="number"
                value={waterGoal}
                onChange={e => setWaterGoal(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Horas Sueño/Noche</label>
              <input
                type="number"
                step="0.5"
                value={sleepGoal}
                onChange={e => setSleepGoal(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Días Ejercicio/Sem</label>
              <input
                type="number"
                value={exerciseGoal}
                onChange={e => setExerciseGoal(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-9 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="size-3.5" />
            Guardar Cambios
          </button>
        </form>
      )}

      {/* CTA — Log habits */}
      <Link
        to="/patient/log-lifestyle"
        className="flex items-center justify-between w-full p-4 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all active:scale-[0.98] shadow-lg shadow-secondary/15"
      >
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Plus className="size-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm text-white">Registrar hábitos diarios</p>
            <p className="text-[11px] text-white/80">
              {entries.length > 0 ? `Último registro: ${entries[0].recorded_at}` : 'Empieza a registrar hoy'}
            </p>
          </div>
        </div>
        <ChevronRight className="size-5 text-white/80" />
      </Link>

      {/* Overview Cards (Adherence Gauge & Prediction) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Adherence Card */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="relative flex-shrink-0 flex items-center justify-center size-20">
            {/* SVG Ring Progress */}
            <svg className="size-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="currentColor"
                strokeWidth="6"
                className="text-muted/10"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="currentColor"
                strokeWidth="6"
                className="text-primary"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - finalAdherencePct / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-extrabold text-foreground">{finalAdherencePct}%</span>
              <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">Adherencia</span>
            </div>
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Nivel de Adherencia</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Mide qué tan consistente eres cumpliendo tus metas de agua, sueño y ejercicio semanal.
            </p>
            <div className="flex gap-2">
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                {finalAdherencePct >= 80 ? 'Excelente' : finalAdherencePct >= 50 ? 'Bueno' : 'Bajo'}
              </span>
            </div>
          </div>
        </div>

        {/* Prediction Card */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="size-4.5 text-secondary animate-pulse" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Predicción y Sugerencia</h3>
          </div>
          <p className="text-xs text-foreground/90 font-medium leading-relaxed">
            {predictionMessage}
          </p>
          {weightChangeRatePerDay < 0 && (
            <div className="flex items-center gap-1 text-[10px] text-secondary font-bold">
              <TrendingDown className="size-3.5" />
              <span>Baja de peso constante detectada</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Habits Progress Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between min-h-[90px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Peso Actual</span>
            <Scale className="size-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <p className="text-lg font-bold text-foreground">
              {currentWeight} <span className="text-xs font-normal text-muted-foreground">kg</span>
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Meta: {goals.target_weight} kg</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between min-h-[90px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Cintura</span>
            <Ruler className="size-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <p className="text-lg font-bold text-foreground">
              {currentWaist} <span className="text-xs font-normal text-muted-foreground">cm</span>
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Meta: {goals.target_waist} cm</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between min-h-[90px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Agua de Ayer</span>
            <Droplet className="size-4 text-sky-500" />
          </div>
          <div className="mt-2">
            <p className="text-lg font-bold text-foreground">
              {entries[0]?.water_glasses || 0} <span className="text-xs font-normal text-muted-foreground">vasos</span>
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Meta diaria: {goals.daily_water_glasses} vasos</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between min-h-[90px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Sueño Promedio</span>
            <Moon className="size-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <p className="text-lg font-bold text-foreground">
              {(last7Entries.reduce((acc, curr) => acc + (curr.sleep_hours || 0), 0) / Math.max(1, last7Entries.length)).toFixed(1)}{' '}
              <span className="text-xs font-normal text-muted-foreground">hs</span>
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Meta de noche: {goals.sleep_goal_hours} hs</p>
          </div>
        </div>
      </div>

      {/* Progress Charts */}
      {chartData.length > 1 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progreso de Peso</p>
            </div>
            <Scale className="size-4 text-amber-500" />
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="patientWeightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }}
                formatter={(v: number) => [`${v} kg`, 'Peso']}
              />
              <Area type="monotone" dataKey="peso" stroke="hsl(38 92% 50%)" strokeWidth={2} fill="url(#patientWeightGradient)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Habits Log History */}
      {entries.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Historial de Hábitos</p>
          <div className="space-y-2">
            {entries.slice(0, 5).map(entry => (
              <div key={entry.id} className="p-3 bg-card border border-border rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="font-semibold flex items-center gap-1">
                    <Calendar className="size-3" />
                    {entry.recorded_at}
                  </span>
                  {entry.mood && (
                    <span>
                      Ánimo: {['😢', '😕', '😐', '🙂', '🤩'][entry.mood - 1]}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {entry.weight && (
                    <span className="text-[10px] bg-muted rounded-full px-2.5 py-0.5 flex items-center gap-1">
                      <Scale className="size-3 text-amber-500" />
                      <span>{entry.weight} kg</span>
                    </span>
                  )}
                  {entry.waist && (
                    <span className="text-[10px] bg-muted rounded-full px-2.5 py-0.5 flex items-center gap-1">
                      <Ruler className="size-3 text-blue-500" />
                      <span>{entry.waist} cm</span>
                    </span>
                  )}
                  {entry.water_glasses !== undefined && (
                    <span className="text-[10px] bg-muted rounded-full px-2.5 py-0.5 flex items-center gap-1">
                      <Droplet className="size-3 text-sky-500" />
                      <span>{entry.water_glasses} vasos</span>
                    </span>
                  )}
                  {entry.sleep_hours !== undefined && (
                    <span className="text-[10px] bg-muted rounded-full px-2.5 py-0.5 flex items-center gap-1">
                      <Moon className="size-3 text-indigo-500" />
                      <span>{entry.sleep_hours} hs</span>
                    </span>
                  )}
                  {entry.exercise_minutes !== undefined && entry.exercise_minutes > 0 && (
                    <span className="text-[10px] bg-muted rounded-full px-2.5 py-0.5 flex items-center gap-1">
                      <Dumbbell className="size-3 text-emerald-500" />
                      <span>{entry.exercise_minutes} min ({entry.exercise_type === 'walking' ? 'Caminar' : entry.exercise_type === 'running' ? 'Trotar' : entry.exercise_type === 'yoga' ? 'Yoga' : entry.exercise_type === 'gym' ? 'Gym' : 'Otro'})</span>
                    </span>
                  )}
                </div>
                {entry.notes && (
                  <p className="text-[11px] text-muted-foreground italic">"{entry.notes}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
