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
    <section id="como-funciona" className="py-24 bg-[#faf8f5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-white text-amber-900 border-amber-600/30 text-xs font-semibold px-3 py-1">
            Passo a Passo
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight">
            Como funciona a rotina com a Golden Contabilidade
          </h2>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
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
                className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400/60 hover:shadow-md transition-all flex flex-col justify-between space-y-5 shadow-xs"
              >
                {/* Step badge top */}
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold font-mono text-base">
                    {st.step}
                  </div>
                  <Badge className="bg-stone-100 text-slate-700 border-stone-200 text-[11px] font-medium">
                    {st.badge}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-950">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{st.desc}</p>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center gap-2 text-xs text-amber-800 font-semibold">
                  <IconC className="w-4 h-4 text-amber-700" />
                  <span>Fluxo Integrado</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Migração Callout */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm shadow-xs">
          <div className="flex items-center gap-3 text-slate-700 text-center sm:text-left">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong className="text-slate-950">Já possui contabilidade ativa?</strong> Solicitamos
              todos os balancetes, procurações e livros ao seu prestador anterior sem custos
              adicionais.
            </span>
          </div>

          <a href="#contratar">
            <span className="text-amber-800 hover:text-amber-900 font-bold inline-flex items-center gap-1.5 shrink-0">
              <span>Migrar sem custo</span>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
