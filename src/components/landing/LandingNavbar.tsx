import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Building2, Menu, Lock, ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { NavDrawer } from './NavDrawer'

interface NavItem {
  to: string
  label: string
  match?: string[]
}

// Links secundários: ficam no dropdown "Mais" entre md e xl, e no menu mobile sempre
const secondaryNavItems: NavItem[] = [
  {
    to: '/institucional#funcionalidades',
    label: 'Funcionalidades',
    match: ['/institucional'],
  },
  { to: '/institucional#faq', label: 'FAQ', match: ['/institucional'] },
  { to: '/planos', label: 'Planos & Preços', match: ['/planos'] },
]

interface LandingNavbarProps {
  onSelectPlanCta?: (regime?: string) => void
}

const linkActiveCls = 'text-amber-800 font-bold border-b-2 border-amber-600 rounded-none'
const linkIdleCls =
  'text-slate-700 hover:text-slate-950 hover:bg-stone-100 rounded-lg border-b-2 border-transparent'

export function LandingNavbar({ onSelectPlanCta }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fecha o menu mobile em mudanças de rota
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Trava o scroll do body enquanto o menu mobile estiver aberto
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // ESC fecha o menu mobile
  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [mobileMenuOpen])

  const isActive = (item: NavItem) =>
    item.match ? item.match.includes(location.pathname) : location.pathname === item.to

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm'
          : 'bg-white/90 backdrop-blur-sm border-b border-stone-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 lg:h-20 py-2 flex items-center justify-between gap-3 sm:gap-4">
        {/* Logotipo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0 focus-visible:outline-2 focus-visible:outline-amber-600 rounded-xl"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shadow-2xs shrink-0 group-hover:border-amber-400 transition-all">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-base sm:text-lg xl:text-xl tracking-tight text-slate-950 block truncate leading-tight group-hover:text-amber-800 transition-colors">
              Golden Contabilidade
            </span>
            <span className="hidden md:block text-[11px] text-amber-800 font-semibold tracking-wide uppercase truncate leading-tight">
              Portal Contábil Integrado • CRC-SP
            </span>
          </div>
        </Link>

        {/* Navegação desktop (xl: links principais + secundários; lg: principais + "Mais") */}
        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-700 shrink-0"
        >
          <Link
            to="/"
            className={`px-3 py-2.5 transition-colors ${location.pathname === '/' ? linkActiveCls : linkIdleCls}`}
          >
            Home
          </Link>
          <Link
            to="/institucional"
            className={`px-3 py-2.5 transition-colors ${location.pathname === '/institucional' ? linkActiveCls : linkIdleCls}`}
          >
            Institucional
          </Link>
          <Link
            to="/planos"
            className={`px-3 py-2.5 flex items-center gap-1.5 whitespace-nowrap transition-colors ${location.pathname === '/planos' ? linkActiveCls : linkIdleCls}`}
          >
            <span>Planos & Preços</span>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Tabela
            </span>
          </Link>

          {/* Dropdown "Mais" — só aparece no desktop intermediário (lg), quando os links
              secundários já não caberiam com folga ao lado dos CTAs */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`hidden lg:inline-flex xl:hidden items-center gap-1 px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-amber-600 ${
                secondaryNavItems.some(isActive)
                  ? 'text-amber-800 border-b-2 border-amber-600 rounded-none'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-stone-100 border-b-2 border-transparent'
              }`}
            >
              Mais
              <ChevronDown className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 bg-white border-stone-200 shadow-lg">
              {secondaryNavItems.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link
                    to={item.to}
                    className="px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-stone-100 focus-visible:bg-stone-100 cursor-pointer rounded-md"
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* No xl, os secundários ganham links próprios com folga */}
          <div className="hidden xl:flex items-center gap-1">
            <Link
              to="/institucional#funcionalidades"
              className={`px-3 py-2.5 whitespace-nowrap transition-colors ${linkIdleCls}`}
            >
              Funcionalidades
            </Link>
            <Link
              to="/institucional#faq"
              className={`px-3 py-2.5 whitespace-nowrap transition-colors ${linkIdleCls}`}
            >
              FAQ
            </Link>
            <Link
              to="/contratar"
              className={`px-3 py-2.5 whitespace-nowrap transition-colors ${
                location.pathname === '/contratar' ? linkActiveCls : linkIdleCls
              }`}
            >
              Contratar
            </Link>
          </div>
        </nav>

        {/* CTAs desktop — sempre visíveis, sem espremer a navegação */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <Link to="/login">
            <Button
              variant="outline"
              className="bg-white hover:bg-stone-50 text-slate-900 border-stone-300 text-sm font-semibold h-10 px-3.5 xl:px-4 gap-1.5 shadow-2xs whitespace-nowrap"
            >
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="hidden xl:inline">Área do Cliente</span>
              <span className="xl:hidden">Entrar</span>
            </Button>
          </Link>

          <Link to="/contratar">
            <Button
              onClick={() => onSelectPlanCta && onSelectPlanCta('simples')}
              className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold h-10 px-3.5 xl:px-4 shadow-xs gap-1.5 xl:gap-2 transition-all whitespace-nowrap"
            >
              <span className="hidden xl:inline">Solicitar Proposta</span>
              <span className="xl:hidden">Proposta</span>
              <ArrowRight className="w-4 h-4 text-white shrink-0" />
            </Button>
          </Link>
        </div>

        {/* Linha mobile/tablet: CTA compacto + botão de menu com área de toque 44px */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <Link
            to="/contratar"
            onClick={() => onSelectPlanCta && onSelectPlanCta('simples')}
            className="hidden xs:inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold h-9 px-3 rounded-lg shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-amber-600"
          >
            <span className="hidden sm:inline">Solicitar Proposta</span>
            <span className="sm:hidden">Proposta</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-haspopup="dialog"
            aria-label="Abrir menu"
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-stone-300 text-slate-800 hover:bg-stone-50 hover:text-slate-950 transition-colors focus-visible:outline-2 focus-visible:outline-amber-600"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menu mobile em drawer (abaixo de lg): itens grandes, legíveis, com scroll trancado */}
      <NavDrawer
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        pathname={location.pathname}
        onSelectPlanCta={onSelectPlanCta}
      />
    </header>
  )
}
