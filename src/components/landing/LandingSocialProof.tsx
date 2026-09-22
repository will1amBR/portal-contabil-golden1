import { Building2, TrendingUp, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react'

export function LandingSocialProof() {
  const metrics = [
    {
      value: '+120',
      label: 'Empresas em Operação',
      subtext: 'Serviços, comércio, tecnologia e franquias',
      icon: Building2,
    },
    {
      value: '100%',
      label: 'Conformidade nos Prazos',
      subtext: 'Nenhuma multa fiscal com nossos alertas',
      icon: ShieldCheck,
    },
    {
      value: '98.4%',
      label: 'Acurácia de Triagem com IA',
      subtext: 'Identificação imediata de impostos e folha',
      icon: TrendingUp,
    },
    {
      value: '15 min',
      label: 'Tempo Médio de Atendimento',
      subtext: 'WhatsApp corporativo e chat integrado',
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
        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-5 sm:p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono tracking-tight group-hover:scale-105 transition-transform">
                  {m.value}
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <m.icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-white leading-tight">{m.label}</h3>
              <p className="text-xs text-slate-400">{m.subtext}</p>
            </div>
          ))}
        </div>

        {/* Client trust marquee/banner */}
        <div className="pt-2 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Empresas que confiam na Golden Contabilidade:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 font-medium text-slate-300">
            {featuredClients.map((client) => (
              <span
                key={client.name}
                className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                title={client.segment}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {client.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
