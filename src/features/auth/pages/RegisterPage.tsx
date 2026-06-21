import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Lock, Stethoscope, Building2, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { useState } from 'react'
import { toast } from 'sonner'
import { supabase, isDemoMode } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

const registerSchema = z.object({
  full_name: z.string().min(3, 'Ingresa tu nombre completo'),
  email: z.string().email('Email inválido'),
  specialty: z.string().min(2, 'Ingresa tu especialidad'),
  clinic_name: z.string().optional(),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirm_password: z.string(),
}).refine(d => d.password === d.confirm_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

const specialties = [
  'Medicina General', 'Cardiología', 'Endocrinología', 'Nefrología',
  'Neumología', 'Pediatría', 'Geriatría', 'Enfermería', 'Otro',
]

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { setSession } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
            specialty: values.specialty,
            clinic_name: values.clinic_name ?? '',
          },
        },
      })
      if (error) throw error
      setSession(data.session)
      toast.success('¡Cuenta creada! Bienvenido a NovaMed.')
      navigate('/onboarding')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrarse'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vt-blue-600 to-vt-blue-700" />
        <div className="absolute top-20 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3" />
        <div className="relative flex items-center gap-3">
          <Logo size={40} showWordmark={false} inverted />
          <div>
            <p className="text-white font-bold">NovaMed</p>
            <p className="text-white/60 text-xs uppercase tracking-widest">Business Solutions</p>
          </div>
        </div>
        <div className="relative space-y-6">
          {[
            'Dashboard clínico en tiempo real',
            'Alertas automáticas de signos vitales',
            'Historial completo de pacientes',
            'Reportes PDF con un clic',
          ].map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="text-secondary-foreground text-xs font-bold">✓</span>
              </div>
              <p className="text-white/90 text-sm">{f}</p>
            </div>
          ))}
        </div>
        <p className="relative text-xs text-white/40">© 2026 Romero Labs</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8 animate-fade-in">
          <Logo size={32} showWordmark className="flex lg:hidden mb-8" />

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Crear cuenta profesional</h1>
            <p className="text-muted-foreground text-sm">14 días de prueba gratis · Sin tarjeta de crédito</p>
          </div>

          {/* Demo Mode Banner */}
          {isDemoMode && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="size-4 text-amber-600 flex-shrink-0 mt-0.5 font-bold">!</div>
              <div>
                <p className="text-xs font-semibold text-amber-800">Modo Demo activo</p>
                <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                  El registro de nuevas cuentas está deshabilitado. Por favor,{' '}
                  <Link to="/login" className="font-bold underline">ve a Iniciar sesión</Link>{' '}
                  y usa los botones de acceso demo.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-foreground mb-1.5">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input id="reg-name" type="text" {...register('full_name')} placeholder="Dr. María García"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>
              {errors.full_name && <p className="mt-1 text-xs text-destructive">{errors.full_name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-foreground mb-1.5">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input id="reg-email" type="email" {...register('email')} placeholder="doctor@clinica.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Specialty */}
            <div>
              <label htmlFor="reg-specialty" className="block text-sm font-medium text-foreground mb-1.5">Especialidad</label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <select id="reg-specialty" {...register('specialty')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors appearance-none">
                  <option value="">Selecciona tu especialidad</option>
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {errors.specialty && <p className="mt-1 text-xs text-destructive">{errors.specialty.message}</p>}
            </div>

            {/* Clinic Name */}
            <div>
              <label htmlFor="reg-clinic" className="block text-sm font-medium text-foreground mb-1.5">
                Clínica / Consultorio <span className="text-muted-foreground">(opcional)</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input id="reg-clinic" type="text" {...register('clinic_name')} placeholder="Clínica del Sur"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-foreground mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input id="reg-password" type="password" {...register('password')} placeholder="Mínimo 8 caracteres"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-foreground mb-1.5">Confirmar contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input id="reg-confirm" type="password" {...register('confirm_password')} placeholder="Repite tu contraseña"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>
              {errors.confirm_password && <p className="mt-1 text-xs text-destructive">{errors.confirm_password.message}</p>}
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={isLoading || isDemoMode}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] mt-2"
            >
              {isLoading
                ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : isDemoMode ? (
                  <span className="text-sm">No disponible en modo demo</span>
                ) : (
                  <><span>Crear cuenta profesional</span><ArrowRight className="size-4" /></>
                )
              }
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Al registrarte aceptas nuestros{' '}
              <a href="#" className="text-primary hover:underline">Términos de Servicio</a>{' '}
              y{' '}
              <a href="#" className="text-primary hover:underline">Política de Privacidad</a>
            </p>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

