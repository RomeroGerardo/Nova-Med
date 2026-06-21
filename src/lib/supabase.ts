import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True cuando la app corre sin credenciales reales (Vercel preview, portfolio demo) */
export const isDemoMode = !supabaseUrl || !supabaseAnonKey

if (isDemoMode) {
  console.warn(
    '⚠️  NovaMed — Modo Demo activo. Las variables VITE_SUPABASE_URL y ' +
    'VITE_SUPABASE_ANON_KEY no están configuradas. ' +
    'Los inicios de sesión reales están deshabilitados.'
  )
}

// En modo demo creamos un cliente con valores dummy que nunca se llama realmente
export const supabase: SupabaseClient = isDemoMode
  ? createClient('https://placeholder.supabase.co', 'placeholder-anon-key')
  : createClient(supabaseUrl!, supabaseAnonKey!)
