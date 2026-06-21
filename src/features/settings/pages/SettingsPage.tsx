import { User, Bell, Shield, CreditCard, Building2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export function SettingsPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-sm text-muted-foreground mt-1">Administra tu cuenta y preferencias de NovaMed.</p>
      </div>

      {/* Sections */}
      {[
        {
          icon: User,
          title: 'Perfil Profesional',
          desc: 'Nombre, especialidad y foto de perfil.',
          fields: [
            { id: 'settings-name', label: 'Nombre completo', value: user?.user_metadata?.full_name ?? '', type: 'text' },
            { id: 'settings-email', label: 'Correo electrónico', value: user?.email ?? '', type: 'email' },
            { id: 'settings-specialty', label: 'Especialidad', value: user?.user_metadata?.specialty ?? '', type: 'text' },
            { id: 'settings-clinic', label: 'Clínica / Consultorio', value: user?.user_metadata?.clinic_name ?? '', type: 'text' },
          ],
        },
        {
          icon: Bell,
          title: 'Notificaciones y Alertas',
          desc: 'Configura los umbrales de alerta para signos vitales.',
          fields: [
            { id: 'settings-bpm-max', label: 'FC máxima (bpm)', value: '90', type: 'number' },
            { id: 'settings-bpm-min', label: 'FC mínima (bpm)', value: '50', type: 'number' },
            { id: 'settings-spo2-min', label: 'SpO2 mínimo (%)', value: '95', type: 'number' },
            { id: 'settings-temp-max', label: 'Temperatura máxima (°C)', value: '38', type: 'number' },
          ],
        },
      ].map(section => (
        <div key={section.title} className="metric-card">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <section.icon className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{section.title}</p>
              <p className="text-xs text-muted-foreground">{section.desc}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.fields.map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-xs font-medium text-foreground mb-1.5">{field.label}</label>
                <input
                  id={field.id}
                  type={field.type}
                  defaultValue={field.value}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-5">
            <button className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Guardar cambios
            </button>
          </div>
        </div>
      ))}

      {/* Plan Info */}
      <div className="metric-card">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
          <div className="size-9 rounded-xl bg-secondary/20 flex items-center justify-center">
            <CreditCard className="size-4 text-secondary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Plan Actual</p>
            <p className="text-xs text-muted-foreground">Gestiona tu suscripción</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-foreground">Plan Professional</span>
              <span className="status-chip-green">Activo</span>
            </div>
            <p className="text-xs text-muted-foreground">Próxima facturación: 10/07/2026 · $79/mes</p>
          </div>
          <button className="text-sm text-primary font-semibold hover:underline">Cambiar plan</button>
        </div>
      </div>

      {/* Security */}
      <div className="metric-card">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
          <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="size-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Seguridad</p>
            <p className="text-xs text-muted-foreground">Contraseña y autenticación</p>
          </div>
        </div>
        <div className="space-y-3">
          <button id="change-password-btn" className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-accent transition-colors">
            <span className="text-sm font-medium text-foreground">Cambiar contraseña</span>
            <span className="text-xs text-muted-foreground">Última actualización: hace 30 días</span>
          </button>
          <button id="enable-2fa-btn" className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-accent transition-colors">
            <span className="text-sm font-medium text-foreground">Autenticación de dos factores</span>
            <span className="text-xs font-semibold text-secondary">Activar</span>
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="border border-destructive/30 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="size-4 text-destructive" />
          <p className="text-sm font-semibold text-destructive">Zona de Peligro</p>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Estas acciones son irreversibles. Procede con cuidado.</p>
        <button id="delete-account-btn" className="text-xs font-semibold text-destructive hover:underline">
          Eliminar cuenta permanentemente
        </button>
      </div>
    </div>
  )
}
