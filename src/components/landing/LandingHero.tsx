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
    <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80">
      {/* Decorative gradient blur orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-4 w-[420px] h-[420px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-[360px] h-[360px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-7">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Contabilidade Digital Inteligente com Triagem por IA</span>
              <span className="hidden sm:inline text-emerald-300/60 font-light">&bull;</span>
              <span className="hidden sm:inline text-amber-300 font-medium">Desde R$ 149/mês</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Sua empresa no{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                piloto automático
              </span>
              , sem multas e com contador dedicado.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A <strong>Golden Contabilidade</strong> une a precisão da Inteligência Artificial à
              segurança de contadores seniores. Envio em lote com triagem instantânea, calendário
              fiscal por regime, emissão de guias e atendimento humano em até 15 minutos.
            </p>

            {/* Quick check bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Simples Nacional, Presumido e Real</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Troca de contador sem dor de cabeça e sem custo</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Triagem por IA com aprovação do contador</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lembretes por e-mail e sino de notificações</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a href="#contratar" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  onClick={() => onSelectPlanCta && onSelectPlanCta('simples')}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 h-12 shadow-lg shadow-emerald-600/30 gap-2 text-base"
                >
                  <span>Abrir Empresa ou Migrar Contabilidade</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>

              <a href="#planos" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700 px-6 h-12 text-sm sm:text-base font-semibold"
                >
                  <span>Ver Planos & Tabela Comparativa</span>
                </Button>
              </a>
            </div>

            {/* Mini Trust indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-white font-semibold ml-1">4.9/5</span>
                <span className="text-slate-400">(+120 clientes auditados)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CRC-SP Ativo & Dados 100% Blindados</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Interactive Product Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/40 via-teal-500/30 to-amber-500/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />

              {/* Mockup card of the portal */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
                {/* Mockup window header */}
                <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-xs font-mono text-slate-400">
                      portal.golden.com.br
                    </span>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] py-0 px-2">
                    Online &bull; 99.98% SLA
                  </Badge>
                </div>

                {/* Mockup interior content */}
                <div className="p-5 space-y-4 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 text-xs">
                  {/* Company switcher bar */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs">
                        KA
                      </div>
                      <div>
                        <p className="font-semibold text-white leading-tight">
                          Koren Ambiental LTDA
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Simples Nacional &bull; CNPJ 45.123.890/0001-44
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 text-white font-mono text-[10px]">
                      Regular
                    </Badge>
                  </div>

                  {/* Feature showcase: AI Batch Upload */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
                        <Bot className="w-3.5 h-3.5 text-emerald-400" />
                        Triagem Automática por IA (4 documentos)
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        98.4% Precisão
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        <span className="text-slate-300 truncate max-w-[180px]">
                          DAS_Simples_04_2025.pdf
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[10px] py-0">
                          Impostos (Tax)
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        <span className="text-slate-300 truncate max-w-[180px]">
                          Folha_Pagto_Abril.xlsx
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-300 border-0 text-[10px] py-0">
                          Holerite (Payroll)
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Feature showcase: Calendar with semaforo */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
                        Calendário com Semáforo de Vencimentos
                      </span>
                      <span className="text-[10px] text-slate-400">Abril/2025</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                        <p className="text-emerald-400 font-bold font-mono">07/04 &bull; FGTS</p>
                        <p className="text-emerald-300/80 text-[9px] mt-0.5">Em dia (Pago)</p>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30">
                        <p className="text-amber-400 font-bold font-mono">20/04 &bull; DAS</p>
                        <p className="text-amber-300/80 text-[9px] mt-0.5">Vence em 4 dias</p>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <p className="text-slate-300 font-bold font-mono">30/04 &bull; DEFIS</p>
                        <p className="text-slate-400 text-[9px] mt-0.5">Agendado</p>
                      </div>
                    </div>
                  </div>

                  {/* Feature showcase: Audit & Accountant Confirmation */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                        P
                      </div>
                      <div>
                        <p className="font-semibold text-white text-[11px] leading-tight">
                          Revisado por Contador Sênior
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Paulinho (CRC 2SP034891) aprovou em lote
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-[10px]">Validado</Badge>
                  </div>
                </div>

                {/* Footer bar inside mockup */}
                <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> Suporte consultivo 24/7
                  </span>
                  <Link
                    to="/login"
                    className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
                  >
                    Ver demonstração &rarr;
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
