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
    <section className="py-14 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Metric cards sólidos e elegantes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-5 sm:p-6 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-bold text-amber-300 font-mono tracking-tight">
                  {m.value}
                </span>
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 flex items-center justify-center">
                  <m.icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">{m.label}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-normal">{m.subtext}</p>
            </div>
          ))}
        </div>

        {/* Client trust marquee/banner com contraste agradável */}
        <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2 text-slate-100 font-medium">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Empresas que confiam na Golden Contabilidade:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 font-medium text-slate-200">
            {featuredClients.map((client) => (
              <span
                key={client.name}
                className="hover:text-amber-200 transition-colors inline-flex items-center gap-2"
                title={client.segment}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {client.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
