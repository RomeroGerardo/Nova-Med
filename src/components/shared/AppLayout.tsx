import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className={cn(
        'flex-1 flex flex-col overflow-auto',
        'transition-all duration-300',
      )}>
        <div className="flex-1 p-6 md:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
