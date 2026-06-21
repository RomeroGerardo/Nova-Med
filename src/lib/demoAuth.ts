import type { User } from '@supabase/supabase-js'

export const DEMO_USER: User = {
  id: 'demo-00000000-0000-0000-0000-000000000001',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'demo@novamed.app',
  email_confirmed_at: '2026-01-01T00:00:00.000Z',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'demo', providers: ['demo'] },
  user_metadata: {
    full_name: 'Dr. Alejandro Romero',
    specialty: 'Cardiología',
    clinic: 'Clínica del Sur',
    avatar_url: null,
  },
  identities: [],
  factors: [],
}

export const DEMO_PATIENT_USER: User = {
  id: 'demo-00000000-0000-0000-0000-000000000002',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'ana.lopez@paciente.novamed.app',
  email_confirmed_at: '2026-01-01T00:00:00.000Z',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'demo', providers: ['demo'] },
  user_metadata: {
    full_name: 'Ana López',
    age: 54,
    professional_name: 'Dr. Alejandro Romero',
    specialty: 'Cardiología',
    avatar_url: null,
  },
  identities: [],
  factors: [],
}

export const isDemoUser = (userId?: string) =>
  userId === DEMO_USER.id

export const isDemoPatient = (userId?: string) =>
  userId === DEMO_PATIENT_USER.id

