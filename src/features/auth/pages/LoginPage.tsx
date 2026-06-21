import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail, ArrowRight, Stethoscope, UserRound } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { useState } from 'react'
import { toast } from 'sonner'
import { supabase, isDemoMode } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { DEMO_USER, DEMO_PATIENT_USER } from '@/lib/demoAuth'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<'professional' | 'patient' | null>(null)
  const { setSession, setUser, setRole } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if (error) throw error
      setSession(data.session)
      toast.success('¡Bienvenido de vuelta!')
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (role: 'professional' | 'patient') => {
    setDemoLoading(role)
    await new Promise(r => setTimeout(r, 700))
    if (role === 'professional') {
      setUser(DEMO_USER)
      setRole('professional')
      toast.success('¡Bienvenido, Dr. Romero! 🎉', { description: 'Accediste al panel profesional en modo Demo.' })
      navigate('/dashboard')
    } else {
      setUser(DEMO_PATIENT_USER)
      setRole('patient')
      toast.success('¡Bienvenida, Ana! 👋', { description: 'Accediste a tu portal de paciente en modo Demo.' })
      navigate('/patient/dashboard')
    }
    setDemoLoading(null)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vt-blue-600 to-vt-blue-700" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative flex items-center gap-3">
          <Logo size={40} showWordmark={false} inverted />
          <div>
            <p className="text-white font-bold">NovaMed</p>
            <p className="text-white/60 text-xs uppercase tracking-widest">Business Solutions</p>
          </div>
        </div>
        <div className="relative">
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            La salud de tus pacientes,<br />siempre en tus manos.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Plataforma clínica de gestión integral para profesionales y clínicas comprometidas con la excelencia médica.
          </p>
        </div>
        <div className="relative text-xs text-white/40">
          © 2026 Romero Labs · Todos los derechos reservados
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <Logo size={32} showWordmark={false} />
            <span className="font-bold">NovaMed</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Iniciar sesión</h1>
            <p className="text-muted-foreground text-sm">Accede a tu cuenta de NovaMed Business</p>
          </div>

          {/* Demo Mode Banner */}
          {isDemoMode && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="size-4 text-amber-600 flex-shrink-0 mt-0.5 font-bold">!</div>
              <div>
                <p className="text-xs font-semibold text-amber-800">Modo Demo activo</p>
                <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                  No hay base de datos configurada. Usa los botones de acceso demo para explorar la app.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="login-email"
                  type="email"
                  {...register('email')}
                  placeholder="doctor@clinica.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="text-sm font-medium text-foreground">Contraseña</label>
                <a href="#" className="text-xs text-primary hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading || isDemoMode}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isDemoMode ? (
                <><span className="text-sm">No disponible en modo demo</span></>
              ) : (
                <>Iniciar sesión <ArrowRight className="size-4" /></>
              )}
            </button>
          </form>

          {/* Demo Access */}
          <div className="mt-6">
            <div className="relative flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">probar sin cuenta</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Professional demo */}
              <button
                id="demo-professional-btn"
                type="button"
                onClick={() => handleDemoLogin('professional')}
                disabled={demoLoading !== null}
                className="flex flex-col items-center gap-2 p-3.5 border border-primary/30 bg-primary/5 text-primary rounded-xl hover:bg-primary/10 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98] group"
              >
                {demoLoading === 'professional' ? (
                  <span className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <Stethoscope className="size-5" />
                )}
                <div className="text-center">
                  <p className="text-xs font-bold leading-tight">Profesional</p>
                  <p className="text-[10px] text-primary/70 leading-tight mt-0.5">Dr. Romero</p>
                </div>
              </button>

              {/* Patient demo */}
              <button
                id="demo-patient-btn"
                type="button"
                onClick={() => handleDemoLogin('patient')}
                disabled={demoLoading !== null}
                className="flex flex-col items-center gap-2 p-3.5 border border-secondary/30 bg-secondary/5 text-secondary rounded-xl hover:bg-secondary/10 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98] group"
              >
                {demoLoading === 'patient' ? (
                  <span className="size-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                ) : (
                  <UserRound className="size-5" />
                )}
                <div className="text-center">
                  <p className="text-xs font-bold leading-tight">Paciente</p>
                  <p className="text-[10px] text-secondary/70 leading-tight mt-0.5">Ana López</p>
                </div>
              </button>
            </div>
            <p className="text-[11px] text-center text-muted-foreground mt-2">
              Sin registro · Datos de ejemplo precargados · Acceso inmediato
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-5">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Regístrate gratis
            </Link>
          </p>

          <div className="mt-6 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-[10px] text-center text-muted-foreground">
              🔒 Conexión segura SSL · Datos protegidos según HIPAA
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

