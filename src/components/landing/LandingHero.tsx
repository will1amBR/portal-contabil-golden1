import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileCheck2,
  CalendarDays,
  Bot,
  Star,
  Users,
  Award,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface LandingHeroProps {
  onSelectPlanCta?: (regime?: string) => void
}

export function LandingHero({ onSelectPlanCta }: LandingHeroProps) {
  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-slate-950 border-b border-slate-800">
      {/* Sóbrio background sutil, sem gradientes chamativos ou cores neon */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b14_1px,transparent_1px),linear-gradient(to_bottom,#1e293b14_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none opacity-40" />
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-7">
            {/* Pill tag sólida e refinada */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-slate-900 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Contabilidade Consultiva &bull; Tecnologia com Rigor Técnico</span>
              <span className="hidden sm:inline text-slate-500">&bull;</span>
              <span className="hidden sm:inline text-slate-200 font-medium">CRC-SP Ativo</span>
            </div>

            {/* Main Headline - Tipografia forte, alto contraste e fácil leitura para 40+ */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-white leading-[1.18]">
              A segurança contábil que a sua empresa precisa, com a agilidade que o mercado exige.
            </h1>

            {/* Subheading - Tamanho confortável e texto sólido */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A <strong>Golden Contabilidade</strong> oferece atendimento consultivo de contadores
              seniores aliado a uma plataforma em nuvem para triagem de notas, controle rigoroso de
              vencimentos e relatórios executivos.
            </p>

            {/* Quick check bullets com alto contraste */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm text-slate-200">
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Simples Nacional, Lucro Presumido e Real</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Migração assistida sem custo e sem atrito</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Triagem inteligente auditada por contadores</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Alertas preventivos para evitar qualquer multa</span>
              </div>
            </div>

            {/* Primary Action Buttons - Cores sólidas e botões com bom padding */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <a href="#contratar" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  onClick={() => onSelectPlanCta && onSelectPlanCta('simples')}
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-7 h-12 shadow-md shadow-amber-950/40 gap-2 text-base transition-all"
                >
                  <span>Solicitar Proposta Comercial</span>
                  <ArrowRight className="w-5 h-5 text-slate-950" />
                </Button>
              </a>

              <a href="#planos" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-700 px-6 h-12 text-sm sm:text-base font-semibold transition-all"
                >
                  <span>Conhecer Planos & Tabela</span>
                </Button>
              </a>
            </div>

            {/* Mini Trust indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300 border-t border-slate-800/80 mt-6">
              <div className="flex items-center gap-1.5 text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-white font-bold ml-1">4.9 / 5</span>
                <span className="text-slate-300">(+120 empresas auditadas)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Responsabilidade Técnica CRC-SP 2SP034891/O</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Cartão Sólido Institucional (Sem neon) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden">
                {/* Mockup window header */}
                <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <span className="ml-2 text-xs font-mono text-slate-300">
                      portal.golden.com.br
                    </span>
                  </div>
                  <Badge className="bg-amber-500/15 text-amber-200 border-amber-500/30 text-[11px] font-medium py-0 px-2">
                    Portal Institucional
                  </Badge>
                </div>

                {/* Mockup interior content */}
                <div className="p-5 sm:p-6 space-y-4 bg-slate-900 text-xs">
                  {/* Company switcher bar */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-amber-600/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-200 text-xs">
                        KA
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm leading-tight">
                          Koren Ambiental LTDA
                        </p>
                        <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                          Simples Nacional &bull; CNPJ 45.123.890/0001-44
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-900/60 text-emerald-200 border border-emerald-700 text-[11px] font-medium">
                      Regular
                    </Badge>
                  </div>

                  {/* Feature showcase: AI Batch Upload */}
                  <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-100 flex items-center gap-2 text-xs">
                        <Bot className="w-4 h-4 text-amber-400" />
                        Triagem Automática de Documentos
                      </span>
                      <span className="text-[11px] text-amber-300 font-mono font-semibold">
                        4 arquivos auditados
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                        <span className="text-slate-200 truncate max-w-[200px]">
                          DAS_Simples_Competencia_04.pdf
                        </span>
                        <Badge className="bg-slate-800 text-slate-200 border-slate-700 text-[10px]">
                          Tributário
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                        <span className="text-slate-200 truncate max-w-[200px]">
                          Folha_Pagamento_Abril.xlsx
                        </span>
                        <Badge className="bg-slate-800 text-slate-200 border-slate-700 text-[10px]">
                          Pessoal / Folha
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Feature showcase: Calendar with semaforo */}
                  <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-100 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-amber-400" />
                        Calendário com Semáforo de Vencimentos
                      </span>
                      <span className="text-[11px] text-slate-300 font-mono">Abril / 2025</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <p className="text-emerald-400 font-bold font-mono">07/04 &bull; FGTS</p>
                        <p className="text-slate-300 text-[10px] mt-0.5">Liquidado</p>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-amber-600/40">
                        <p className="text-amber-300 font-bold font-mono">20/04 &bull; DAS</p>
                        <p className="text-slate-200 text-[10px] mt-0.5 font-medium">Em 4 dias</p>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <p className="text-slate-300 font-bold font-mono">30/04 &bull; DEFIS</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">Agendado</p>
                      </div>
                    </div>
                  </div>

                  {/* Feature showcase: Audit & Accountant Confirmation */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-amber-600/20 text-amber-200 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                        PC
                      </div>
                      <div>
                        <p className="font-semibold text-white text-xs leading-tight">
                          Validação Técnica Registrada
                        </p>
                        <p className="text-[11px] text-slate-300">
                          Contador responsável: Paulo César (CRC-SP)
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-900/60 text-emerald-200 border border-emerald-700 text-[10px]">
                      Aprovado
                    </Badge>
                  </div>
                </div>

                {/* Footer bar inside mockup */}
                <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Atendimento consultivo ágil
                  </span>
                  <Link to="/login" className="text-amber-300 hover:text-amber-200 font-semibold">
                    Área do cliente &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
