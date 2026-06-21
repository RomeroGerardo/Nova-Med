import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import type { Role } from '@/types'

interface AuthStore {
  user: User | null
  session: Session | null
  role: Role | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setRole: (role: Role | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      role: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session, user: session?.user ?? null }),
      setRole: (role) => set({ role }),
      setLoading: (isLoading) => set({ isLoading }),
      signOut: () => set({ user: null, session: null, role: null }),
    }),
    {
      name: 'novamed-auth',
      partialize: (state) => ({ user: state.user, role: state.role }),
    }
  )
)
