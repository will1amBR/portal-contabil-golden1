import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Building2, Menu, X, Lock, ArrowRight, Sparkles, Phone, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LandingNavbarProps {
  onSelectPlanCta?: (regime?: string) => void
}

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

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 shadow-xl'
          : 'bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/70'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-md shadow-amber-950/40 ring-1 ring-amber-400/30 group-hover:ring-amber-400/60 transition-all">
            <Building2 className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-white block group-hover:text-amber-200 transition-colors">
                Golden Contabilidade
              </span>
            </div>
            <span className="text-[11px] text-amber-300/80 font-medium tracking-wide uppercase block">
              Portal Contábil Integrado &bull; CRC-SP
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-200">
          <Link
            to="/"
            className={`transition-colors py-1 ${
              location.pathname === '/'
                ? 'text-amber-300 font-semibold border-b-2 border-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Home
          </Link>
          <Link
            to="/institucional"
            className={`transition-colors py-1 ${
              location.pathname === '/institucional'
                ? 'text-amber-300 font-semibold border-b-2 border-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Institucional
          </Link>
          <Link
            to="/planos"
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              location.pathname === '/planos'
                ? 'text-amber-300 font-semibold border-b-2 border-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            <span>Planos & Preços</span>
            <span className="bg-amber-500/15 text-amber-200 border border-amber-400/30 text-[10px] font-semibold px-2 py-0.5 rounded">
              Tabela
            </span>
          </Link>
          <Link
            to="/institucional#funcionalidades"
            className="hover:text-amber-200 transition-colors"
          >
            Funcionalidades
          </Link>
          <Link to="/institucional#faq" className="hover:text-amber-200 transition-colors">
            FAQ
          </Link>
          <Link
            to="/contratar"
            className={`transition-colors py-1 ${
              location.pathname === '/contratar'
                ? 'text-amber-300 font-semibold border-b-2 border-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Contratar
          </Link>
        </nav>

        {/* Desktop Action CTA buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/login">
            <Button
              variant="outline"
              className="bg-slate-900/90 hover:bg-slate-850 hover:text-white text-slate-200 border-slate-700 text-xs sm:text-sm font-semibold h-10 px-4 gap-1.5 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Área do Cliente</span>
            </Button>
          </Link>

          <Link to="/contratar">
            <Button
              onClick={() => onSelectPlanCta && onSelectPlanCta('simples')}
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs sm:text-sm font-bold h-10 px-4.5 shadow-md shadow-amber-950/30 gap-2 transition-all"
            >
              <span>Solicitar Proposta</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <Link to="/login">
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-900 text-slate-200 border-slate-700 text-xs font-semibold h-9 px-3"
            >
              <Lock className="w-3.5 h-3.5 mr-1 text-amber-400" /> Login
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-4 animate-fade-in">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-200">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg ${
                location.pathname === '/'
                  ? 'bg-slate-900 text-amber-300 font-bold'
                  : 'hover:bg-slate-900 hover:text-amber-200'
              }`}
            >
              Home (A Golden)
            </Link>
            <Link
              to="/institucional"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg ${
                location.pathname === '/institucional'
                  ? 'bg-slate-900 text-amber-300 font-bold'
                  : 'hover:bg-slate-900 hover:text-amber-200'
              }`}
            >
              Institucional (Portal & Soluções)
            </Link>
            <Link
              to="/planos"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg flex items-center justify-between ${
                location.pathname === '/planos'
                  ? 'bg-slate-900 text-amber-300 font-bold'
                  : 'hover:bg-slate-900 hover:text-amber-200'
              }`}
            >
              <span>Planos & Tabela Comparativa</span>
              <span className="bg-amber-500/15 text-amber-200 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-400/30">
                Tabela
              </span>
            </Link>
            <Link
              to="/institucional#funcionalidades"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-900 hover:text-amber-200"
            >
              Funções Entregues do Portal
            </Link>
            <Link
              to="/institucional#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-900 hover:text-amber-200"
            >
              Perguntas Frequentes (FAQ)
            </Link>
            <Link
              to="/contratar"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg font-bold ${
                location.pathname === '/contratar'
                  ? 'bg-amber-500/20 text-amber-200'
                  : 'hover:bg-slate-900 text-amber-300'
              }`}
            >
              Contratar / Solicitar Proposta
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/contratar"
              onClick={() => {
                setMobileMenuOpen(false)
                if (onSelectPlanCta) onSelectPlanCta('simples')
              }}
            >
              <Button className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold h-11 text-sm shadow-md">
                Solicitar Proposta Agora &rarr;
              </Button>
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full bg-slate-900 text-slate-200 border-slate-700 text-xs h-10"
              >
                Acessar Área do Cliente (Login)
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
