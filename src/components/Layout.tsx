import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Wallet,
  Calculator,
  Scale,
  MessageSquare,
  LogOut,
  Clock,
  Building2,
  ClipboardCheck,
  BarChart3,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  Layers,
  Menu,
  X,
  User,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { RequiredDocsModal } from '@/components/RequiredDocsModal'
import { ClientOnboardingModal } from '@/components/ClientOnboardingModal'
import {
  getConfirmationDocuments,
  getPendingDocuments,
  getCompaniesByOwner,
  getTaxRegimesRequirements,
  type Company,
  type TaxRegimeRequirement,
} from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'

export default function Layout() {
  const { user, isAccountant, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [confirmationCount, setConfirmationCount] = useState<number>(0)
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const [clientCompany, setClientCompany] = useState<Company | null>(null)
  const [requirements, setRequirements] = useState<TaxRegimeRequirement[]>([])

  // Check onboarding on client login
  useEffect(() => {
    if (!isAccountant && user) {
      const isCompleted = localStorage.getItem(`onboarding_completed_${user.name || 'client'}`)
      if (!isCompleted) {
        setOnboardingOpen(true)
      }

      getCompaniesByOwner(user.id)
        .then(async (comps) => {
          if (comps.length > 0) {
            setClientCompany(comps[0])
            const reqs = await getTaxRegimesRequirements(comps[0].tax_regime)
            setRequirements(reqs)
          }
        })
        .catch(() => {})
    }
  }, [isAccountant, user])

  // Quick stats badge for accountant
  const fetchBadgeCounts = async () => {
    if (!isAccountant) return
    try {
      const [conf, pend] = await Promise.all([getConfirmationDocuments(), getPendingDocuments()])
      setConfirmationCount(conf.length)
      setPendingCount(pend.length)
    } catch {
      // silent
    }
  }

  useEffect(() => {
    fetchBadgeCounts()
  }, [isAccountant, location.pathname])

  useRealtime('documents', () => {
    fetchBadgeCounts()
  })

  const clientNav = [
    { name: 'Visão Geral', path: '/cliente/dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Todos Documentos', path: '/cliente/documentos', icon: FileText, badge: null },
    { name: 'Guias Fiscais', path: '/cliente/guias', icon: Receipt, badge: 'Impostos' },
    { name: 'Holerites & RH', path: '/cliente/holerites', icon: Wallet, badge: null },
    { name: 'Contábeis', path: '/cliente/contabeis', icon: Calculator, badge: null },
    { name: 'Legais & Contratos', path: '/cliente/legais', icon: Scale, badge: null },
    { name: 'Relatório Mensal', path: '/relatorios', icon: BarChart3, badge: 'PDF' },
    { name: 'Assistente IA', path: '/chat', icon: MessageSquare, badge: 'IA' },
  ]

  const adminNav = [
    { name: 'Visão Geral', path: '/', icon: LayoutDashboard, badge: null },
    {
      name: 'Triagem & Confirmação',
      path: '/admin/documentos/confirmacao',
      icon: ClipboardCheck,
      count: confirmationCount,
      countColor: 'bg-indigo-500 text-white',
    },
    {
      name: 'Validação Pendente',
      path: '/admin/documentos/pendentes',
      icon: Clock,
      count: pendingCount,
      countColor: 'bg-amber-500 text-white',
    },
    { name: 'Base de Documentos', path: '/admin/documentos', icon: FileText, badge: null },
    { name: 'Relatório Mensal', path: '/relatorios', icon: BarChart3, badge: 'PDF' },
    { name: 'Empresas & Clientes', path: '/companies', icon: Building2, badge: null },
    { name: 'Assistente IA', path: '/chat', icon: MessageSquare, badge: 'IA' },
  ]

  const navItems = isAccountant ? adminNav : clientNav

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const handleSignOut = () => {
    signOut()
    navigate('/login')
  }

  const renderNavList = (onItemClick?: () => void) => (
    <div className="space-y-6">
      <div>
        <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>{isAccountant ? 'Gestão do Escritório' : 'Menu do Cliente'}</span>
          <span className="text-[10px] text-emerald-400 font-mono">
            {isAccountant ? 'CONTABILIDADE' : 'EMPRESA'}
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path)
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onItemClick}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80',
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-transform group-hover:scale-110',
                      active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400',
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded font-semibold',
                        active
                          ? 'bg-emerald-700/80 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-300',
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-bold',
                        item.countColor || 'bg-slate-800 text-white',
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
      {/* Office info card in sidebar */}
      <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-200 font-semibold">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Golden Contabilidade</span>
          </div>
          {!isAccountant && (
            <button
              onClick={() => {
                setOnboardingOpen(true)
                if (onItemClick) onItemClick()
              }}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-medium"
            >
              Guia Inicial
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {isAccountant
            ? 'Atendimento ativo para Koren Ambiental e carteira de clientes.'
            : 'Escritório contábil responsável pelo processamento fiscal e legal.'}
        </p>
      </div>{' '}
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Desktop Sidebar (Dark Executive Slate Theme) */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-950 text-slate-100 border-r border-slate-800/80 shadow-2xl relative z-20">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-300/30">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">
                Portal Contábil
              </span>
              <span className="text-[11px] text-emerald-400 font-medium block">
                Golden Contabilidade
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-6">{renderNavList()}</div>

        {/* User profile & sign out at bottom */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="w-8 h-8 border border-emerald-500/40">
                <AvatarFallback className="bg-emerald-600 text-white text-xs font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {isAccountant ? 'Contador Responsável' : 'Cliente &bull; Koren'}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Encerrar sessão"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100">
        {/* Sticky Global Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Mobile Sheet Trigger & Logo */}
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-slate-700">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 bg-slate-950 text-white p-0 border-slate-800"
              >
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white">Golden Contabilidade</span>
                      <span className="text-[10px] text-emerald-400 block">Portal Integrado</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 overflow-y-auto max-h-[calc(100vh-5rem)]">
                  {renderNavList(() => setMobileOpen(false))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Breadcrumb / Context indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">
                {isAccountant ? 'Painel do Escritório' : 'Portal da Empresa'}
              </span>
              <span className="text-slate-300">/</span>
              <span className="hidden sm:inline text-slate-500">
                {isAccountant ? 'Gestão & Conformidade' : 'Koren Ambiental LTDA'}
              </span>
            </div>
          </div>

          {/* Right actions: Quick IA badge, notifications and user profile dropdown */}
          <div className="flex items-center gap-3">
            <Link to="/chat">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs hover:bg-emerald-100 transition-colors cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium">Assistente IA Ativo</span>
              </div>
            </Link>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 p-1.5 pl-2 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all outline-none">
                  <Avatar className="w-8 h-8 border border-emerald-200 shadow-2xs">
                    <AvatarFallback className="bg-emerald-700 text-white text-xs font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {user?.name || 'Usuário'}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {isAccountant ? 'Contador' : 'Cliente'} &bull; {user?.email}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 bg-white shadow-xl border-slate-200">
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                    <Badge className="w-fit mt-1 bg-emerald-100 text-emerald-800 text-[10px]">
                      {isAccountant ? 'Escritório Contábil' : 'Empresa / Cliente'}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/relatorios" className="flex items-center gap-2 text-xs py-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" /> Relatórios do Mês
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/chat" className="flex items-center gap-2 text-xs py-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" /> Falar com Assistente IA
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 text-xs py-2"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Encerrar Sessão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto animate-fade-in-up pb-24 lg:pb-8">
          {!isAccountant && <RequiredDocsModal />}
          {!isAccountant && (
            <ClientOnboardingModal
              open={onboardingOpen}
              onOpenChange={setOnboardingOpen}
              userName={user?.name || 'William'}
              company={clientCompany}
              requirements={requirements}
              onDocumentUploaded={() => {
                fetchBadgeCounts()
              }}
            />
          )}
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Bar for Quick Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 flex justify-around items-center px-1 py-2 z-40 text-slate-400">
        {navItems.slice(0, 5).map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center p-1.5 rounded-lg flex-1 transition-colors relative',
                active ? 'text-emerald-400' : 'text-slate-400 hover:text-white',
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium truncate max-w-[60px] text-center">
                {item.name.split(' ')[0]}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
