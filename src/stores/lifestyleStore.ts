import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LifestyleEntry, LifestyleGoals } from '@/types'

// Helper to calculate date strings relative to today
const getRelativeDateString = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

const DEMO_PATIENT_ID = 'demo-00000000-0000-0000-0000-000000000002'

const SEED_GOALS: LifestyleGoals = {
  patient_id: DEMO_PATIENT_ID,
  target_weight: 63,
  target_waist: 75,
  daily_water_glasses: 8,
  sleep_goal_hours: 7,
  exercise_days_per_week: 3,
}

// 14 days of mock lifestyle history ending yesterday or today
const SEED_LIFESTYLE: LifestyleEntry[] = [
  {
    id: 'l-001',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(13),
    weight: 66.8,
    waist: 79.0,
    sleep_hours: 6.5,
    water_glasses: 5,
    exercise_minutes: 0,
    mood: 3,
    notes: 'Primer día de registro. Un poco cansada.',
  },
  {
    id: 'l-002',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(12),
    weight: 66.7,
    waist: 78.8,
    sleep_hours: 7.0,
    water_glasses: 7,
    exercise_minutes: 30,
    exercise_type: 'walking',
    mood: 4,
    notes: 'Salí a caminar por la tarde.',
  },
  {
    id: 'l-003',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(11),
    weight: 66.5,
    waist: 78.8,
    sleep_hours: 7.5,
    water_glasses: 8,
    exercise_minutes: 0,
    mood: 4,
  },
  {
    id: 'l-004',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(10),
    weight: 66.4,
    waist: 78.5,
    sleep_hours: 6.0,
    water_glasses: 6,
    exercise_minutes: 45,
    exercise_type: 'yoga',
    mood: 3,
  },
  {
    id: 'l-005',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(9),
    weight: 66.2,
    waist: 78.5,
    sleep_hours: 8.0,
    water_glasses: 9,
    exercise_minutes: 0,
    mood: 5,
    notes: 'Dormí súper bien. Tomé mucha agua.',
  },
  {
    id: 'l-006',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(8),
    weight: 66.1,
    waist: 78.2,
    sleep_hours: 7.0,
    water_glasses: 8,
    exercise_minutes: 40,
    exercise_type: 'cycling',
    mood: 4,
  },
  {
    id: 'l-007',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(7),
    weight: 65.9,
    waist: 78.0,
    sleep_hours: 6.5,
    water_glasses: 8,
    exercise_minutes: 0,
    mood: 4,
  },
  {
    id: 'l-008',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(6),
    weight: 65.8,
    waist: 78.0,
    sleep_hours: 7.5,
    water_glasses: 9,
    exercise_minutes: 50,
    exercise_type: 'gym',
    mood: 5,
  },
  {
    id: 'l-009',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(5),
    weight: 65.7,
    waist: 77.8,
    sleep_hours: 8.0,
    water_glasses: 8,
    exercise_minutes: 0,
    mood: 4,
  },
  {
    id: 'l-010',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(4),
    weight: 65.5,
    waist: 77.7,
    sleep_hours: 7.0,
    water_glasses: 7,
    exercise_minutes: 30,
    exercise_type: 'walking',
    mood: 4,
  },
  {
    id: 'l-011',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(3),
    weight: 65.4,
    waist: 77.6,
    sleep_hours: 6.5,
    water_glasses: 8,
    exercise_minutes: 0,
    mood: 3,
  },
  {
    id: 'l-012',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(2),
    weight: 65.3,
    waist: 77.5,
    sleep_hours: 7.2,
    water_glasses: 9,
    exercise_minutes: 60,
    exercise_type: 'running',
    mood: 5,
    notes: 'Gran día de trote. Me siento liviana.',
  },
  {
    id: 'l-013',
    patient_id: DEMO_PATIENT_ID,
    recorded_at: getRelativeDateString(1),
    weight: 65.1,
    waist: 77.5,
    sleep_hours: 7.5,
    water_glasses: 8,
    exercise_minutes: 0,
    mood: 4,
  },
]

interface LifestyleStore {
  entries: LifestyleEntry[]
  goals: Record<string, LifestyleGoals>
  addEntry: (entry: Omit<LifestyleEntry, 'id'>) => LifestyleEntry
  getEntriesForPatient: (patientId: string) => LifestyleEntry[]
  getGoalsForPatient: (patientId: string) => LifestyleGoals
  updateGoalsForPatient: (patientId: string, goals: Partial<LifestyleGoals>) => void
}

export const useLifestyleStore = create<LifestyleStore>()(
  persist(
    (set, get) => ({
      entries: SEED_LIFESTYLE,
      goals: {
        [DEMO_PATIENT_ID]: SEED_GOALS,
      },

      addEntry: (entryData) => {
        // Find if an entry already exists for this date and patient, and update or append
        const newEntry: LifestyleEntry = {
          ...entryData,
          id: `l-${Date.now()}`,
        }

        set((state) => {
          const filtered = state.entries.filter(
            (e) => !(e.patient_id === entryData.patient_id && e.recorded_at === entryData.recorded_at)
          )
          return { entries: [newEntry, ...filtered] }
        })

        return newEntry
      },

      getEntriesForPatient: (patientId) => {
        return get()
          .entries.filter((e) => e.patient_id === patientId)
          .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
      },

      getGoalsForPatient: (patientId) => {
        const state = get()
        if (!state.goals[patientId]) {
          // Default fallback goals
          return {
            patient_id: patientId,
            target_weight: 70,
            target_waist: 80,
            daily_water_glasses: 8,
            sleep_goal_hours: 8,
            exercise_days_per_week: 3,
          }
        }
        return state.goals[patientId]
      },

      updateGoalsForPatient: (patientId, updatedGoals) => {
        set((state) => {
          const current = state.goals[patientId] || {
            patient_id: patientId,
            target_weight: 70,
            target_waist: 80,
            daily_water_glasses: 8,
            sleep_goal_hours: 8,
            exercise_days_per_week: 3,
          }
          return {
            goals: {
              ...state.goals,
              [patientId]: {
                ...current,
                ...updatedGoals,
              },
            },
          }
        })
      },
    }),
    {
      name: 'novamed-lifestyle',
    }
  )
)
