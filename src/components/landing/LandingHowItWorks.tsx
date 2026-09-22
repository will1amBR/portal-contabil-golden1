import { ArrowRight, UploadCloud, Cpu, CheckCircle2, BellRing, UserCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function LandingHowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Diagnóstico & Transição Segura',
      desc: 'Preencha o formulário ou solicite a migração. Nossa equipe cuida de toda a transição de livros contábeis com seu contador anterior sem atrito.',
      badge: 'Início',
      icon: UserCheck,
    },
    {
      step: '02',
      title: 'Envio Centralizado & Triagem',
      desc: 'No dia a dia, basta arrastar suas notas fiscais, extratos e guias para o portal. A triagem organiza tudo por categoria fiscal em segundos.',
      badge: 'Rotina',
      icon: UploadCloud,
    },
    {
      step: '03',
      title: 'Conferência e Validação CRC',
      desc: 'Nossos contadores seniores revisam as apurações, emitem as guias DAS/DARF e calculam a folha de pagamento com rigor e rastreabilidade.',
      badge: 'Auditoria',
      icon: Cpu,
    },
    {
      step: '04',
      title: 'Alertas de Vencimento & DRE',
      desc: 'Você recebe lembretes antecipados no portal e por e-mail para evitar qualquer multa, além de balancetes e DRE executivos em PDF.',
      badge: 'Resultado',
      icon: BellRing,
    },
  ]

  return (
    <section id="como-funciona" className="py-24 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-slate-900 text-amber-200 border-amber-500/30 text-xs font-semibold px-3 py-1">
            Passo a Passo
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Como funciona a rotina com a Golden Contabilidade
          </h2>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
            Uma rotina estruturada para que o empresário dedique poucos minutos ao mês com
            obrigações fiscais e tenha total segurança sobre seus números.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st) => {
            const IconC = st.icon
            return (
              <div
                key={st.step}
                className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-5"
              >
                {/* Step badge top */}
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 flex items-center justify-center font-bold font-mono text-base">
                    {st.step}
                  </div>
                  <Badge className="bg-slate-950 text-slate-200 border-slate-800 text-[11px] font-medium">
                    {st.badge}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{st.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-amber-300 font-semibold">
                  <IconC className="w-4 h-4 text-amber-400" />
                  <span>Fluxo Integrado</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Migração Callout */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-3 text-slate-200 text-center sm:text-left">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Já possui contabilidade ativa?</strong> Solicitamos todos os balancetes,
              procurações e livros ao seu prestador anterior sem custos adicionais.
            </span>
          </div>

          <a href="#contratar">
            <span className="text-amber-300 hover:text-amber-200 font-bold inline-flex items-center gap-1.5 shrink-0">
              <span>Migrar sem custo</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
