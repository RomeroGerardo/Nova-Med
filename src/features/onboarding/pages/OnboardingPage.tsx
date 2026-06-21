import { useNavigate } from 'react-router-dom'
import { ActivitySquare, Users, BarChart3, Bell, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'

const steps = [
  {
    step: 1,
    icon: ActivitySquare,
    title: '¡Bienvenido a NovaMed!',
    desc: 'Tu plataforma clínica profesional está lista. Configuremos tu cuenta en 3 pasos simples.',
    cta: 'Comenzar',
  },
  {
    step: 2,
    icon: Users,
    title: 'Agrega tus primeros pacientes',
    desc: 'Importa o agrega pacientes manualmente. Registra sus datos básicos y empieza a monitorear sus signos vitales.',
    cta: 'Entendido',
  },
  {
    step: 3,
    icon: BarChart3,
    title: 'Monitorea en tiempo real',
    desc: 'Accede a dashboards completos, histórico de métricas y alertas automáticas cuando los valores se salgan del rango normal.',
    cta: 'Siguiente',
  },
  {
    step: 4,
    icon: Bell,
    title: 'Activa las alertas inteligentes',
    desc: 'Configura umbrales personalizados para frecuencia cardíaca, presión arterial, SpO2 y glucosa. Recibe notificaciones al instante.',
    cta: 'Ir al Dashboard',
  },
]

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const step = steps[currentStep]
  const Icon = step.icon
  const isLast = currentStep === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      navigate('/dashboard')
    } else {
      setCurrentStep(c => c + 1)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 bg-primary' : i < currentStep ? 'w-4 bg-primary/40' : 'w-4 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-10 shadow-premium text-center animate-fade-in">
          <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Icon className="size-10 text-primary" />
          </div>

          <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Paso {step.step} de {steps.length}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            {currentStep === 0 && user?.user_metadata?.full_name
              ? `¡Hola, ${user.user_metadata.full_name.split(' ')[0]}!`
              : step.title}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            {step.desc}
          </p>

          {/* Checklist preview */}
          {currentStep === 0 && (
            <div className="text-left space-y-2.5 mb-8 bg-muted/40 rounded-xl p-4">
              {['Perfil profesional configurado', 'Dashboard personalizado listo', 'Soporte 24/7 disponible'].map(item => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-secondary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          )}

          <button
            id={`onboarding-step-${step.step}`}
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            {step.cta} {!isLast && <ArrowRight className="size-4" />}
          </button>

          {!isLast && (
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Saltar introducción
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
