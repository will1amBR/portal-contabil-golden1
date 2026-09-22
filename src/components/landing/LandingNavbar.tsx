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
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl'
          : 'bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/institucional" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-300/30 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block group-hover:text-emerald-300 transition-colors">
                Golden Contabilidade
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium block">
              Portal Contábil Integrado
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link
            to="/institucional"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            Início
          </Link>
          <a href="#funcionalidades" className="hover:text-emerald-400 transition-colors">
            Funções Entregues
          </a>
          <Link
            to="/planos"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <span>Planos & Preços</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              Comparativo
            </span>
          </Link>
          <a href="#como-funciona" className="hover:text-emerald-400 transition-colors">
            Como Funciona
          </a>
          <a href="#faq" className="hover:text-emerald-400 transition-colors">
            Dúvidas
          </a>
          <Link to="/contratar" className="hover:text-emerald-400 transition-colors">
            Contratar
          </Link>
        </nav>

        {/* Desktop Action CTA buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/login">
            <Button
              variant="outline"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 text-xs sm:text-sm font-semibold h-10 px-4 gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Área do Cliente</span>
            </Button>
          </Link>

          <a href="#contratar">
            <Button
              onClick={() => onSelectPlanCta && onSelectPlanCta('simples')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold h-10 px-4 shadow-md shadow-emerald-600/20 gap-2"
            >
              <span>Contratar Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <Link to="/login">
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-900 text-slate-200 border-slate-700 text-xs font-semibold h-9 px-3"
            >
              <Lock className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Login
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-4 animate-fade-in">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            <Link
              to="/institucional"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-900 hover:text-emerald-400"
            >
              Início Institucional
            </Link>
            <a
              href="#funcionalidades"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-900 hover:text-emerald-400"
            >
              Funções Entregues do Portal
            </a>
            <Link
              to="/planos"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-900 hover:text-emerald-400 flex items-center justify-between"
            >
              <span>Planos & Tabela Comparativa</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Novo
              </span>
            </Link>
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-900 hover:text-emerald-400"
            >
              Como Funciona a Parceria
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-900 hover:text-emerald-400"
            >
              Perguntas Frequentes (FAQ)
            </a>
            <Link
              to="/contratar"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-900 hover:text-emerald-400 text-emerald-400 font-bold"
            >
              Contratar / Solicitar Proposta
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <a
              href="#contratar"
              onClick={() => {
                setMobileMenuOpen(false)
                if (onSelectPlanCta) onSelectPlanCta('simples')
              }}
            >
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 text-sm shadow-md">
                Solicitar Proposta Agora &rarr;
              </Button>
            </a>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full bg-slate-900 text-slate-200 border-slate-700 text-xs h-10"
              >
                Acessar Portal do Cliente (Login)
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
