// Core domain types for NovaMed Business Solutions

export type Role = 'professional' | 'patient'

export interface PatientVitalEntry {
  id: string
  patient_id: string        // links to the demo patient user id
  recorded_at: string       // ISO timestamp
  heart_rate?: number       // bpm
  blood_pressure_sys?: number
  blood_pressure_dia?: number
  oxygen_saturation?: number // %
  temperature?: number      // °C
  weight?: number           // kg
  glucose?: number          // mg/dL
  notes?: string
  recorded_by: 'patient' | 'professional'
}

export type ExerciseType = 'walking' | 'running' | 'cycling' | 'swimming' | 'yoga' | 'gym' | 'other'

export interface LifestyleEntry {
  id: string
  patient_id: string
  recorded_at: string        // ISO date (YYYY-MM-DD) — one per day
  weight?: number            // kg
  waist?: number             // cm
  sleep_hours?: number       // hours (0.5 step)
  water_glasses?: number     // glasses of 250ml
  exercise_minutes?: number  // minutes
  exercise_type?: ExerciseType
  mood?: 1 | 2 | 3 | 4 | 5  // 1=muy mal, 5=excelente
  notes?: string
}

export interface LifestyleGoals {
  patient_id: string
  target_weight?: number     // kg
  target_waist?: number      // cm
  daily_water_glasses: number
  sleep_goal_hours: number
  exercise_days_per_week: number
}

export interface Professional {
  id: string
  email: string
  full_name: string
  license_number?: string
  specialty?: string
  clinic_name?: string
  avatar_url?: string
  plan: 'starter' | 'professional' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  professional_id: string
  full_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  medical_record_number?: string
  notes?: string
  status: 'active' | 'inactive' | 'archived'
  created_at: string
  updated_at: string
}

export interface VitalRecord {
  id: string
  patient_id: string
  recorded_at: string
  heart_rate?: number         // bpm
  blood_pressure_sys?: number // mmHg
  blood_pressure_dia?: number // mmHg
  oxygen_saturation?: number  // %
  temperature?: number        // °C
  weight?: number             // kg
  glucose?: number            // mg/dL
  notes?: string
  created_by: string
}

export interface Appointment {
  id: string
  professional_id: string
  patient_id: string
  patient?: Patient
  title: string
  date: string
  duration_minutes: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  created_at: string
}

export interface DashboardMetrics {
  total_patients: number
  active_patients: number
  appointments_today: number
  appointments_week: number
  critical_alerts: number
  avg_heart_rate: number
  avg_spo2: number
}

export type Plan = {
  id: 'starter' | 'professional' | 'enterprise'
  name: string
  price_monthly: number
  price_yearly: number
  features: string[]
  highlighted?: boolean
}
