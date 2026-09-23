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
          ? 'bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm'
          : 'bg-white/90 backdrop-blur-sm border-b border-stone-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shadow-2xs group-hover:border-amber-400 transition-all">
            <Building2 className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-950 block group-hover:text-amber-800 transition-colors">
                Golden Contabilidade
              </span>
            </div>
            <span className="text-[11px] text-amber-800 font-semibold tracking-wide uppercase block">
              Portal Contábil Integrado &bull; CRC-SP
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <Link
            to="/"
            className={`transition-colors py-1 ${
              location.pathname === '/'
                ? 'text-amber-800 font-bold border-b-2 border-amber-600'
                : 'hover:text-slate-950'
            }`}
          >
            Home
          </Link>
          <Link
            to="/institucional"
            className={`transition-colors py-1 ${
              location.pathname === '/institucional'
                ? 'text-amber-800 font-bold border-b-2 border-amber-600'
                : 'hover:text-slate-950'
            }`}
          >
            Institucional
          </Link>
          <Link
            to="/planos"
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              location.pathname === '/planos'
                ? 'text-amber-800 font-bold border-b-2 border-amber-600'
                : 'hover:text-slate-950'
            }`}
          >
            <span>Planos & Preços</span>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Tabela
            </span>
          </Link>
          <Link
            to="/institucional#funcionalidades"
            className="hover:text-slate-950 transition-colors"
          >
            Funcionalidades
          </Link>
          <Link to="/institucional#faq" className="hover:text-slate-950 transition-colors">
            FAQ
          </Link>
          <Link
            to="/contratar"
            className={`transition-colors py-1 ${
              location.pathname === '/contratar'
                ? 'text-amber-800 font-bold border-b-2 border-amber-600'
                : 'hover:text-slate-950'
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
              className="bg-white hover:bg-stone-50 text-slate-900 border-stone-300 text-xs sm:text-sm font-semibold h-10 px-4 gap-1.5 shadow-2xs"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Área do Cliente</span>
            </Button>
          </Link>

          <Link to="/contratar">
            <Button
              onClick={() => onSelectPlanCta && onSelectPlanCta('simples')}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold h-10 px-4.5 shadow-xs gap-2 transition-all"
            >
              <span>Solicitar Proposta</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <Link to="/login">
            <Button
              size="sm"
              variant="outline"
              className="bg-white text-slate-900 border-stone-300 text-xs font-semibold h-9 px-3"
            >
              <Lock className="w-3.5 h-3.5 mr-1 text-amber-700" /> Login
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white border border-stone-300 text-slate-800 hover:text-slate-950"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-lg">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg ${
                location.pathname === '/'
                  ? 'bg-amber-50 text-amber-900 font-bold'
                  : 'hover:bg-stone-100 hover:text-slate-950'
              }`}
            >
              Home (A Golden)
            </Link>
            <Link
              to="/institucional"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg ${
                location.pathname === '/institucional'
                  ? 'bg-amber-50 text-amber-900 font-bold'
                  : 'hover:bg-stone-100 hover:text-slate-950'
              }`}
            >
              Institucional (Portal & Soluções)
            </Link>
            <Link
              to="/planos"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg flex items-center justify-between ${
                location.pathname === '/planos'
                  ? 'bg-amber-50 text-amber-900 font-bold'
                  : 'hover:bg-stone-100 hover:text-slate-950'
              }`}
            >
              <span>Planos & Tabela Comparativa</span>
              <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-300">
                Tabela
              </span>
            </Link>
            <Link
              to="/institucional#funcionalidades"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-stone-100 hover:text-slate-950"
            >
              Funções Entregues do Portal
            </Link>
            <Link
              to="/institucional#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-stone-100 hover:text-slate-950"
            >
              Perguntas Frequentes (FAQ)
            </Link>
            <Link
              to="/contratar"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-lg font-bold ${
                location.pathname === '/contratar'
                  ? 'bg-amber-100 text-amber-900'
                  : 'hover:bg-stone-100 text-amber-800'
              }`}
            >
              Contratar / Solicitar Proposta
            </Link>
          </nav>

          <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
            <Link
              to="/contratar"
              onClick={() => {
                setMobileMenuOpen(false)
                if (onSelectPlanCta) onSelectPlanCta('simples')
              }}
            >
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold h-11 text-sm shadow-xs">
                Solicitar Proposta Agora &rarr;
              </Button>
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full bg-white text-slate-800 border-stone-300 text-xs h-10 shadow-2xs"
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
