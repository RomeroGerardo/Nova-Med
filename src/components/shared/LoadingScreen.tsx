import { Logo } from './Logo'

export function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-background">
      <Logo size={48} showWordmark={false} />
      <p className="text-sm text-muted-foreground animate-pulse">Cargando NovaMed...</p>
    </div>
  )
}
