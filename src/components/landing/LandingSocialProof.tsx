import { Building2, TrendingUp, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react'

export function LandingSocialProof() {
  const metrics = [
    {
      value: '+120',
      label: 'Empresas Atendidas',
      subtext: 'Serviços, comércio, indústria e clínicas',
      icon: Building2,
    },
    {
      value: '100%',
      label: 'Conformidade com Prazos',
      subtext: 'Zero multas com nosso controle rigoroso',
      icon: ShieldCheck,
    },
    {
      value: '98.4%',
      label: 'Precisão na Triagem',
      subtext: 'Identificação imediata de impostos e folha',
      icon: TrendingUp,
    },
    {
      value: '< 15 min',
      label: 'Retorno Humano Ágil',
      subtext: 'WhatsApp corporativo e telefone direto',
      icon: Clock,
    },
  ]

  const featuredClients = [
    { name: 'Koren Ambiental LTDA', segment: 'Engenharia e Gestão Ambiental' },
    { name: 'Nexus Softwares & Cloud', segment: 'Tecnologia da Informação' },
    { name: 'Vértice Consultoria Estratégica', segment: 'Serviços Profissionais' },
    { name: 'Aliança Distribuidora & Comércio', segment: 'Comércio Atacadista' },
    { name: 'Studio M Arquitetura & Interiores', segment: 'Design & Arquitetura' },
  ]

  return (
    <section className="py-14 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Metric cards sólidos e elegantes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-5 sm:p-6 rounded-xl bg-[#faf8f5] border border-stone-200 hover:border-amber-400/60 hover:shadow-sm transition-all space-y-2 group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-bold text-amber-800 font-mono tracking-tight">
                  {m.value}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-amber-700 flex items-center justify-center shadow-xs">
                  <m.icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-950 leading-tight">
                {m.label}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-normal">{m.subtext}</p>
            </div>
          ))}
        </div>

        {/* Client trust marquee/banner com contraste agradável */}
        <div className="pt-4 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Empresas que confiam na Golden Contabilidade:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 font-medium text-slate-700">
            {featuredClients.map((client) => (
              <span
                key={client.name}
                className="hover:text-amber-800 transition-colors inline-flex items-center gap-2"
                title={client.segment}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                {client.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
