import { Link } from 'react-router-dom'
import {
  Shield, TrendingUp, Users, CheckCircle2,
  ArrowRight, Heart, Stethoscope, BarChart3, Star
} from 'lucide-react'
import { Logo } from '@/components/shared/Logo'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    features: ['Hasta 50 pacientes', '1 profesional', 'Métricas básicas', 'Soporte email'],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    highlighted: true,
    features: ['Hasta 500 pacientes', '5 profesionales', 'Dashboard avanzado', 'Alertas automáticas', 'Soporte prioritario', 'Exportación de datos'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    features: ['Pacientes ilimitados', 'Profesionales ilimitados', 'IA predictiva', 'Integración EHR', 'SLA 99.9%', 'Soporte dedicado 24/7'],
  },
]

const features = [
  { icon: Heart, title: 'Monitoreo de Signos Vitales', desc: 'Registro en tiempo real de frecuencia cardíaca, presión arterial, SpO2 y más.' },
  { icon: Shield, title: 'Seguridad de Datos', desc: 'Cumplimiento HIPAA. Cifrado de extremo a extremo para proteger la información clínica.' },
  { icon: TrendingUp, title: 'Analytics Clínicos', desc: 'Tendencias y visualizaciones para tomar decisiones basadas en datos.' },
  { icon: Users, title: 'Multi-Profesional', desc: 'Gestiona equipos completos de salud con roles y permisos granulares.' },
  { icon: Stethoscope, title: 'Historial Completo', desc: 'Acceso al historial clínico completo de cada paciente desde cualquier dispositivo.' },
  { icon: BarChart3, title: 'Reportes Automáticos', desc: 'Genera reportes clínicos en PDF con un clic para compartir con colegas.' },
]

const testimonials = [
  { name: 'Dra. Valentina Méndez', role: 'Cardióloga - Clínica del Sur', text: 'NovaMed transformó cómo monitoreamos a nuestros pacientes cardíacos. Reducimos los reingresos en un 30%.', stars: 5 },
  { name: 'Dr. Carlos Romero', role: 'Médico Clínico - Centro Salud Norte', text: 'La facilidad de uso y la potencia de los dashboards hacen que mi equipo adopte la herramienta al instante.', stars: 5 },
  { name: 'Lic. Andrea Vega', role: 'Enfermera Jefe - Hospital Regional', text: 'Las alertas automáticas nos ayudaron a detectar a tiempo dos situaciones críticas el primer mes.', stars: 5 },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size={32} showWordmark showTagline={false} />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Precios</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonios</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Prueba gratis <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-vt-green-50 text-vt-green-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-vt-green-100">
            <span className="size-1.5 bg-vt-green-500 rounded-full animate-pulse" />
            Plataforma B2B de Salud Digital
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
            Gestiona la salud de tus{' '}
            <span className="text-primary relative">
              pacientes
              <span className="absolute bottom-1 left-0 right-0 h-1 bg-secondary/50 rounded-full" />
            </span>{' '}
            con precisión clínica
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            NovaMed es la plataforma SaaS para clínicas y profesionales de la salud que quieren
            monitorear, analizar y actuar sobre los datos vitales de sus pacientes — en tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
            >
              Comenzar gratis por 14 días <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 text-foreground font-medium px-6 py-3.5 rounded-xl border border-border hover:bg-accent transition-colors"
            >
              Ver demo en vivo
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">Sin tarjeta de crédito · Configuración en 5 minutos · Cancela cuando quieras</p>
        </div>

        {/* Stats bar */}
        <div className="max-w-3xl mx-auto mt-20 grid grid-cols-3 gap-6">
          {[
            { value: '+12K', label: 'Pacientes monitoreados' },
            { value: '98.9%', label: 'Uptime garantizado' },
            { value: '+500', label: 'Profesionales activos' },
          ].map(stat => (
            <div key={stat.label} className="text-center p-5 rounded-xl border border-border bg-card shadow-premium">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">FUNCIONALIDADES</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Todo lo que tu clínica necesita</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Diseñado por y para profesionales de la salud que exigen precisión, velocidad y confiabilidad.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="metric-card group hover:-translate-y-1 transition-transform duration-200">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">PRECIOS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Planes para cada escala</h2>
            <p className="text-muted-foreground mt-4">Comienza gratis. Crece sin límites.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-7 border transition-all duration-200 ${
                  plan.highlighted
                    ? 'border-primary shadow-lg shadow-primary/10 bg-card scale-105'
                    : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-secondary text-secondary-foreground text-xs font-bold px-4 py-1 rounded-full">
                      MÁS POPULAR
                    </span>
                  </div>
                )}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-sm text-muted-foreground">/mes</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="size-4 text-secondary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-accent text-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  Comenzar ahora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">TESTIMONIOS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Profesionales que confían en NovaMed</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="metric-card">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-5">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <h2 className="relative text-3xl font-bold text-white mb-4">¿Listo para transformar tu práctica clínica?</h2>
          <p className="relative text-primary-foreground/80 mb-8 text-sm">Únete a más de 500 profesionales que ya gestionan la salud de sus pacientes con NovaMed.</p>
          <Link
            to="/register"
            className="relative inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all"
          >
            Empezar prueba gratuita <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size={24} showWordmark showTagline={false} />
          <p className="text-xs text-muted-foreground">© 2026 Romero Labs. Todos los derechos reservados.</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
            <a href="#" className="hover:text-foreground transition-colors">Términos</a>
            <a href="#" className="hover:text-foreground transition-colors">HIPAA</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
