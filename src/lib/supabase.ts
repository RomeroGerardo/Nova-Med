import type { SupabaseClient } from '@supabase/supabase-js'

/** True cuando la app corre sin credenciales reales (Vercel preview, portfolio demo) */
export const isDemoMode = true

console.warn(
  '⚠️  NovaMed — Modo Demo activo. Toda la conexión a Supabase está anulada para funcionar offline.'
)

// En modo demo creamos un mock completo de Supabase para evitar importar y ejecutar createClient, 
// lo cual previene cualquier tipo de error de conexión o crash en Vercel.
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: {}, error: new Error('Supabase deshabilitado en modo demo') }),
    signUp: async () => ({ data: {}, error: new Error('Supabase deshabilitado en modo demo') }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
  }
} as unknown as SupabaseClient
