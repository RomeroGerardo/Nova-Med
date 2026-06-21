import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PatientVitalEntry } from '@/types'

// Seed data — vitals "pre-loaded" by the demo patient (Ana López)
const SEED_VITALS: PatientVitalEntry[] = [
  {
    id: 'v-001',
    patient_id: 'demo-00000000-0000-0000-0000-000000000002',
    recorded_at: '2026-06-04T08:15:00.000Z',
    heart_rate: 74,
    blood_pressure_sys: 122,
    blood_pressure_dia: 80,
    oxygen_saturation: 97,
    temperature: 36.5,
    weight: 65.5,
    notes: 'Me siento bien hoy, descansé bien.',
    recorded_by: 'patient',
  },
  {
    id: 'v-002',
    patient_id: 'demo-00000000-0000-0000-0000-000000000002',
    recorded_at: '2026-06-05T09:30:00.000Z',
    heart_rate: 71,
    blood_pressure_sys: 120,
    blood_pressure_dia: 78,
    oxygen_saturation: 98,
    temperature: 36.6,
    weight: 65.3,
    notes: 'Sin novedades. Tomé el atenolol.',
    recorded_by: 'patient',
  },
  {
    id: 'v-003',
    patient_id: 'demo-00000000-0000-0000-0000-000000000002',
    recorded_at: '2026-06-06T07:45:00.000Z',
    heart_rate: 78,
    blood_pressure_sys: 125,
    blood_pressure_dia: 82,
    oxygen_saturation: 97,
    temperature: 36.8,
    weight: 65.5,
    notes: 'Algo de tensión por el trabajo.',
    recorded_by: 'patient',
  },
  {
    id: 'v-004',
    patient_id: 'demo-00000000-0000-0000-0000-000000000002',
    recorded_at: '2026-06-07T08:00:00.000Z',
    heart_rate: 73,
    blood_pressure_sys: 118,
    blood_pressure_dia: 76,
    oxygen_saturation: 98,
    temperature: 36.4,
    recorded_by: 'patient',
  },
  {
    id: 'v-005',
    patient_id: 'demo-00000000-0000-0000-0000-000000000002',
    recorded_at: '2026-06-08T09:10:00.000Z',
    heart_rate: 69,
    blood_pressure_sys: 116,
    blood_pressure_dia: 75,
    oxygen_saturation: 99,
    temperature: 36.3,
    weight: 65.1,
    notes: 'Me siento muy bien. Salí a caminar.',
    recorded_by: 'patient',
  },
  {
    id: 'v-006',
    patient_id: 'demo-00000000-0000-0000-0000-000000000002',
    recorded_at: '2026-06-09T08:30:00.000Z',
    heart_rate: 75,
    blood_pressure_sys: 121,
    blood_pressure_dia: 79,
    oxygen_saturation: 98,
    temperature: 36.5,
    recorded_by: 'patient',
  },
  {
    id: 'v-007',
    patient_id: 'demo-00000000-0000-0000-0000-000000000002',
    recorded_at: '2026-06-10T08:00:00.000Z',
    heart_rate: 72,
    blood_pressure_sys: 118,
    blood_pressure_dia: 78,
    oxygen_saturation: 98,
    temperature: 36.5,
    weight: 65.2,
    notes: 'Control rutinario de la mañana.',
    recorded_by: 'patient',
  },
]

interface VitalsStore {
  entries: PatientVitalEntry[]
  addEntry: (entry: Omit<PatientVitalEntry, 'id' | 'recorded_at'>) => PatientVitalEntry
  getEntriesForPatient: (patientId: string) => PatientVitalEntry[]
  getLatestForPatient: (patientId: string) => PatientVitalEntry | null
}

export const useVitalsStore = create<VitalsStore>()(
  persist(
    (set, get) => ({
      entries: SEED_VITALS,

      addEntry: (entryData) => {
        const newEntry: PatientVitalEntry = {
          ...entryData,
          id: `v-${Date.now()}`,
          recorded_at: new Date().toISOString(),
        }
        set((state) => ({ entries: [newEntry, ...state.entries] }))
        return newEntry
      },

      getEntriesForPatient: (patientId) => {
        return get()
          .entries.filter((e) => e.patient_id === patientId)
          .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
      },

      getLatestForPatient: (patientId) => {
        const entries = get().getEntriesForPatient(patientId)
        return entries[0] ?? null
      },
    }),
    {
      name: 'novamed-vitals',
    }
  )
)
