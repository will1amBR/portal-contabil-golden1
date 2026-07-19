import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { LayoutDashboard, Users, FileText, MessageSquare, LogOut, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function Layout() {
  const { user, isAccountant, signOut } = useAuth()
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ...(isAccountant ? [{ name: 'Empresas', path: '/companies', icon: Users }] : []),
    { name: 'Documentos', path: '/documents', icon: FileText },
    { name: 'Assistente', path: '/chat', icon: MessageSquare },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900">Portal Contábil</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3',
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600',
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-600"
            onClick={signOut}
          >
            <LogOut className="w-5 h-5" />
            Sair
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex-1 max-w-md hidden md:flex items-center relative">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <Input
              placeholder="Buscar documentos..."
              className="pl-9 bg-slate-50 border-none focus-visible:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{isAccountant ? 'Contador' : 'Cliente'}</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-auto animate-fade-in-up">
          <Outlet />
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center p-2 text-slate-500"
          >
            <item.icon
              className={cn('w-6 h-6', location.pathname === item.path && 'text-emerald-600')}
            />
            <span className="text-[10px] mt-1">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
