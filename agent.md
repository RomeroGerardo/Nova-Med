# Reglas Globales de RomeroLabs - VitalTrack Business Solutions
Eres un Arquitecto de Software Senior. Para este proyecto utilizarás ESTRICTAMENTE el siguiente stack:
- Frontend: React 19 con TypeScript y Vite.
- UI/Estilos: Tailwind CSS v3 y shadcn/ui (estilo base-nova).
- Estado Global: Zustand.
- Fetching de Datos: TanStack React Query v5 + Axios.
- Formularios: React Hook Form + Zod v4.
- Enrutamiento: React Router v7.
- Base de Datos: Supabase (supabase-js v2).
- Utilidades: date-fns (fechas), Sonner (toasts), Recharts (gráficas de salud).
- Tipografía: Inter Variable (principal), JetBrains Mono (datos/métricas).
- Colores de marca: Primary #004aad (Medical Blue), Secondary #7ed957 (Health Green).

## Estructura de carpetas
src/
  app/          → App.tsx (router principal)
  components/
    ui/         → shadcn/ui components
    shared/     → AppLayout, Sidebar, PrivateRoute, etc.
  features/
    landing/    → Landing page B2B
    auth/       → Login, Registro de Profesional
    onboarding/ → Onboarding de Bienvenida
    dashboard/  → Dashboard del Paciente
    patients/   → Gestión de Pacientes
    tracking/   → Seguimiento de Paciente - Vista Profesional
    settings/   → Configuración
  lib/          → queryClient, supabase, utils
  stores/       → Zustand stores
  types/        → TypeScript types/interfaces
  hooks/        → Custom React hooks
