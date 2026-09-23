import { Link } from 'react-router-dom'
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  ExternalLink,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 border-t border-stone-300 text-slate-300 text-xs sm:text-sm selection:bg-amber-500/30 selection:text-white">
      {/* Top Banner inside Footer */}
      <div className="border-b border-slate-800/80 py-10 bg-slate-900/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Golden Contabilidade &bull; Inteligência & Gestão Integrada
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                CRC-SP 2SP034891/O &bull; Rigor técnico, planejamento tributário e conformidade
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/login">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm font-semibold cursor-pointer transition-colors">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Área do Cliente (Login)</span>
              </span>
            </Link>

            <Link to="/contratar">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-xs">
                <span>Solicitar Proposta</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-amber-600 flex items-center justify-center text-slate-950 font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white block">
                  Golden Contabilidade
                </span>
                <span className="text-[11px] text-amber-300 font-medium block">
                  Portal Contábil Integrado
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              Unimos contadores seniores experientes e infraestrutura digital segura com controle de
              prazos fiscais, balancetes executivos e atendimento ágil para empresas em todo o
              Brasil.
            </p>

            <div className="pt-2 flex items-center gap-2 text-slate-200">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs">
                Registro ativo no Conselho Regional de Contabilidade (CRC-SP)
              </span>
            </div>
          </div>

          {/* Col 2: Institucional & Navegação */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Institucional</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-amber-300 transition-colors text-slate-300">
                  Home (A Golden)
                </Link>
              </li>
              <li>
                <Link
                  to="/institucional"
                  className="hover:text-amber-300 transition-colors text-slate-300"
                >
                  Sobre a Empresa & Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/planos"
                  className="hover:text-amber-300 transition-colors text-slate-300"
                >
                  Planos & Preços (Tabela)
                </Link>
              </li>
              <li>
                <Link
                  to="/contratar"
                  className="hover:text-amber-300 transition-colors text-slate-300"
                >
                  Solicitar Proposta Comercial
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-300 transition-colors text-slate-300">
                  Área do Cliente (Login)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Soluções & Planos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Planos & Regimes
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  to="/planos"
                  className="hover:text-amber-300 transition-colors text-slate-300"
                >
                  Simples Nacional (desde R$ 149)
                </Link>
              </li>
              <li>
                <Link
                  to="/planos"
                  className="hover:text-amber-300 transition-colors text-slate-300"
                >
                  Lucro Presumido (desde R$ 249)
                </Link>
              </li>
              <li>
                <Link
                  to="/planos"
                  className="hover:text-amber-300 transition-colors text-slate-300"
                >
                  Lucro Real / Corporativo
                </Link>
              </li>
              <li>
                <Link
                  to="/institucional#funcionalidades"
                  className="hover:text-amber-300 transition-colors text-slate-300"
                >
                  Triagem Inteligente de Documentos
                </Link>
              </li>
              <li>
                <Link
                  to="/institucional#funcionalidades"
                  className="hover:text-amber-300 transition-colors text-slate-300"
                >
                  Calendário Fiscal com Semáforo
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contato & Suporte */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Fale Conosco</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200">contato@golden.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200">(11) 3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200">(11) 98765-4321 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200">Seg-Sex: 08h às 18h</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200">Av. Paulista, 1000 - SP</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom credits bar */}
        <div className="pt-10 mt-10 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {currentYear} Golden Contabilidade &bull; Todos os direitos reservados. CNPJ
            12.345.678/0001-90.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-amber-300 transition-colors">
              Home Golden
            </Link>
            <span>&bull;</span>
            <Link to="/login" className="hover:text-amber-300 transition-colors">
              Área do Cliente
            </Link>
            <span>&bull;</span>
            <Link to="/institucional#faq" className="hover:text-amber-300 transition-colors">
              Perguntas Frequentes
            </Link>
            <span>&bull;</span>
            <span className="text-slate-400">Termos & Conformidade LGPD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
