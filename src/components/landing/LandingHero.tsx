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
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-white via-[#faf8f5] to-[#f4efe8] border-b border-stone-200">
      {/* Sóbrio background sutil, sem gradientes chamativos ou cores neon */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f014_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f014_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-7">
            {/* Pill tag sólida e refinada */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-600/30 text-amber-900 text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-slate-900">
                Contabilidade Consultiva &bull; Tecnologia com Rigor Técnico
              </span>
              <span className="hidden sm:inline text-stone-400">&bull;</span>
              <span className="hidden sm:inline text-amber-800 font-semibold">CRC-SP Ativo</span>
            </div>

            {/* Main Headline - Tipografia forte, alto contraste e fácil leitura para 40+ */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-950 leading-[1.18]">
              A segurança contábil que a sua empresa precisa, com a agilidade que o mercado exige.
            </h1>

            {/* Subheading - Tamanho confortável e texto sólido */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A <strong className="text-slate-950">Golden Contabilidade</strong> oferece atendimento
              consultivo de contadores seniores aliado a uma plataforma em nuvem para triagem de
              notas, controle rigoroso de vencimentos e relatórios executivos.
            </p>

            {/* Quick check bullets com alto contraste */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm text-slate-700">
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-medium">Simples Nacional, Lucro Presumido e Real</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-medium">Migração assistida sem custo e sem atrito</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-medium">Triagem inteligente auditada por contadores</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-medium">Alertas preventivos para evitar qualquer multa</span>
              </div>
            </div>

            {/* Primary Action Buttons - Cores sólidas e botões com bom padding */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <a href="#contratar" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  onClick={() => onSelectPlanCta && onSelectPlanCta('simples')}
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold px-7 h-12 shadow-sm gap-2 text-base transition-all"
                >
                  <span>Solicitar Proposta Comercial</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </Button>
              </a>

              <a href="#planos" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white hover:bg-stone-50 text-slate-900 border-stone-300 px-6 h-12 text-sm sm:text-base font-semibold transition-all shadow-xs"
                >
                  <span>Conhecer Planos & Tabela</span>
                </Button>
              </a>
            </div>

            {/* Mini Trust indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-700 border-t border-stone-200 mt-6">
              <div className="flex items-center gap-1.5 text-amber-700">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
                <span className="text-slate-950 font-bold ml-1">4.9 / 5</span>
                <span className="text-slate-600">(+120 empresas auditadas)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span className="font-semibold text-slate-900">
                  Responsabilidade Técnica CRC-SP 2SP034891/O
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Cartão Sólido Institucional (Sem neon) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-2xl bg-white border border-stone-200 shadow-xl overflow-hidden">
                {/* Mockup window header */}
                <div className="px-4 py-3 bg-[#faf8f5] border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                    <span className="ml-2 text-xs font-mono text-slate-600 font-semibold">
                      portal.golden.com.br
                    </span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[11px] font-semibold py-0 px-2">
                    Portal Institucional
                  </Badge>
                </div>

                {/* Mockup interior content */}
                <div className="p-5 sm:p-6 space-y-4 bg-white text-xs">
                  {/* Company switcher bar */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-stone-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-amber-900 text-xs">
                        KA
                      </div>
                      <div>
                        <p className="font-bold text-slate-950 text-sm leading-tight">
                          Koren Ambiental LTDA
                        </p>
                        <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                          Simples Nacional &bull; CNPJ 45.123.890/0001-44
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[11px] font-semibold">
                      Regular
                    </Badge>
                  </div>

                  {/* Feature showcase: AI Batch Upload */}
                  <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 flex items-center gap-2 text-xs">
                        <Bot className="w-4 h-4 text-amber-700" />
                        Triagem Automática de Documentos
                      </span>
                      <span className="text-[11px] text-amber-800 font-mono font-bold">
                        4 arquivos auditados
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200 text-xs">
                        <span className="text-slate-800 truncate max-w-[200px] font-medium">
                          DAS_Simples_Competencia_04.pdf
                        </span>
                        <Badge className="bg-stone-100 text-slate-700 border-stone-200 text-[10px]">
                          Tributário
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200 text-xs">
                        <span className="text-slate-800 truncate max-w-[200px] font-medium">
                          Folha_Pagamento_Abril.xlsx
                        </span>
                        <Badge className="bg-stone-100 text-slate-700 border-stone-200 text-[10px]">
                          Pessoal / Folha
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Feature showcase: Calendar with semaforo */}
                  <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-amber-700" />
                        Calendário com Semáforo de Vencimentos
                      </span>
                      <span className="text-[11px] text-slate-600 font-mono font-medium">
                        Abril / 2025
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-white border border-stone-200">
                        <p className="text-emerald-700 font-bold font-mono">07/04 &bull; FGTS</p>
                        <p className="text-slate-600 text-[10px] mt-0.5">Liquidado</p>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-amber-300 shadow-2xs">
                        <p className="text-amber-800 font-bold font-mono">20/04 &bull; DAS</p>
                        <p className="text-slate-800 text-[10px] mt-0.5 font-semibold">Em 4 dias</p>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-stone-200">
                        <p className="text-slate-700 font-bold font-mono">30/04 &bull; DEFIS</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">Agendado</p>
                      </div>
                    </div>
                  </div>

                  {/* Feature showcase: Audit & Accountant Confirmation */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-stone-200 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs border border-amber-300">
                        PC
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950 text-xs leading-tight">
                          Validação Técnica Registrada
                        </p>
                        <p className="text-[11px] text-slate-600">
                          Contador responsável: Paulo César (CRC-SP)
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-semibold">
                      Aprovado
                    </Badge>
                  </div>
                </div>

                {/* Footer bar inside mockup */}
                <div className="px-5 py-3 bg-[#faf8f5] border-t border-stone-200 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    Atendimento consultivo ágil
                  </span>
                  <Link to="/login" className="text-amber-800 hover:text-amber-900 font-bold">
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
