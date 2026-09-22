import { ArrowRight, UploadCloud, Cpu, CheckCircle2, BellRing, UserCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function LandingHowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Contratação & Onboarding Sem Atrito',
      desc: 'Preencha o formulário online ou solicite a migração. Cuidamos do encerramento com seu contador anterior sem que você precise se desgastar.',
      badge: 'Dia 1',
      icon: UserCheck,
    },
    {
      step: '02',
      title: 'Envio Descomplicado por IA',
      desc: 'No dia a dia, basta arrastar suas notas fiscais, extratos e guias para o portal. A IA categoriza tudo em segundos.',
      badge: 'Em Minutos',
      icon: UploadCloud,
    },
    {
      step: '03',
      title: 'Apuração & Validação do Contador',
      desc: 'Nosso time técnico de contadores seniores revisa as apurações, emite guias DAS/DARF e calcula a folha de pagamento com duplo check.',
      badge: 'Sempre em Dia',
      icon: Cpu,
    },
    {
      step: '04',
      title: 'Alertas Ativos & Relatórios Prontos',
      desc: 'Você recebe notificações no portal e por e-mail antes do vencimento, além de relatórios executivos em PDF para tomada de decisão.',
      badge: 'Zero Multas',
      icon: BellRing,
    },
  ]

  return (
    <section id="como-funciona" className="py-24 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-semibold px-3 py-1">
            Passo a Passo
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Como funciona a rotina com a Golden Contabilidade
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Uma experiência desenhada para você gastar menos de 10 minutos por mês com a rotina
            contábil e focar 100% no crescimento do seu negócio.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => {
            const IconC = st.icon
            return (
              <div
                key={st.step}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-5 relative group"
              >
                {/* Step badge top */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-extrabold font-mono text-lg group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all">
                    {st.step}
                  </div>
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                    {st.badge}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{st.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <IconC className="w-4 h-4" />
                  <span>Fluxo 100% Digital</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Migração Callout */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-3 text-slate-300 text-center sm:text-left">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Já tem contador?</strong> Nós solicitamos todos os documentos e livros fiscais
              ao seu contador atual. Sem atritos e sem parar suas operações.
            </span>
          </div>

          <a href="#contratar">
            <span className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 shrink-0 hover:underline">
              <span>Migrar agora sem custo</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
