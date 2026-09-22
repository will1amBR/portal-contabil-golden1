import { useState } from 'react'
import {
  Check,
  X,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Zap,
  Building,
  Building2,
  Factory,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface LandingPlansComparisonProps {
  onSelectPlan: (regime: string) => void
}

export function LandingPlansComparison({ onSelectPlan }: LandingPlansComparisonProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const plans = [
    {
      id: 'simples',
      name: 'Simples Nacional',
      tag: 'Ideal para prestadores de serviços, PMEs e comércio inicial',
      icon: Building,
      popular: true,
      priceMonthly: 149,
      priceAnnual: 129,
      period: '/mês',
      disclaimer: 'Preço a partir de. Varia de acordo com faturamento e número de colaboradores.',
      leadRegime: 'simples',
      topHighlights: [
        'Acesso total ao Portal Integrado Golden',
        'Upload em lote com triagem por IA',
        'Cálculo e emissão mensal do DAS',
        'Calendário fiscal com semáforo de vencimentos',
        'Folha de pagamento (até 3 colaboradores)',
        'Suporte por WhatsApp e Chat IA 24/7',
      ],
    },
    {
      id: 'presumido',
      name: 'Lucro Presumido',
      tag: 'Para empresas estruturadas, clínicas, transportes e comércio médio',
      icon: Building2,
      popular: false,
      priceMonthly: 249,
      priceAnnual: 219,
      period: '/mês',
      disclaimer: 'Preço a partir de. Apuração trimestral IRPJ/CSLL e SPEDs inclusos.',
      leadRegime: 'presumido',
      topHighlights: [
        'Tudo do Plano Simples Nacional',
        'Apuração trimestral IRPJ, CSLL, PIS e COFINS',
        'Escriturações EFD Contribuições, EFD ICMS e ECD',
        'Folha de pagamento (até 15 colaboradores)',
        'Planejamento tributário semestral consultivo',
        'Contador sênior dedicado com reuniões trimestrais',
      ],
    },
    {
      id: 'real',
      name: 'Lucro Real / Corporativo',
      tag: 'Para indústrias, faturamento acima de R$ 78M ou margem reduzida',
      icon: Factory,
      popular: false,
      priceMonthly: null, // Sob consulta
      priceAnnual: null,
      period: '',
      disclaimer: 'Proposta sob medida com diagnóstico fiscal prévio gratuito.',
      leadRegime: 'real',
      topHighlights: [
        'Toda a infraestrutura contábil enterprise da Golden',
        'Apuração mensal por balancete de redução/suspensão',
        'LALUR / LACS digital e conciliação multi-bancária',
        'Auditoria preventiva de créditos tributários (PIS/COFINS)',
        'Reunião mensal de diretoria e concelho fiscal',
        'SLA de atendimento prioritário em até 1 hora',
      ],
    },
  ]

  // Comparison Matrix Rows
  const comparisonCategories = [
    {
      category: 'Tecnologia & Portal Contábil',
      rows: [
        {
          feature: 'Acesso multiusuário ao Portal Integrado',
          tooltip: 'Acesso web responsivo para gestor, sócios e financeiro',
          simples: true,
          presumido: true,
          real: true,
        },
        {
          feature: 'Categorização automática de documentos com IA',
          tooltip: 'IA treinada para identificar impostos, holerites, contratos e notas',
          simples: true,
          presumido: true,
          real: true,
        },
        {
          feature: 'Upload em lote com drag & drop',
          tooltip: 'Suba múltiplos arquivos com análise individual simultânea',
          simples: true,
          presumido: true,
          real: true,
        },
        {
          feature: 'Calendário de obrigações com semáforo',
          tooltip: 'Visualização de prazos específicos do seu regime tributário',
          simples: true,
          presumido: true,
          real: true,
        },
        {
          feature: 'Sino de alertas no portal + realtime',
          tooltip: 'Avisos visuais na barra superior sem precisar recarregar',
          simples: true,
          presumido: true,
          real: true,
        },
        {
          feature: 'Lembretes automáticos por e-mail pré-vencimento',
          tooltip: 'Disparo com link direto da guia antes do vencimento para evitar multas',
          simples: true,
          presumido: true,
          real: true,
        },
        {
          feature: 'Chat com Assistente IA 24/7',
          tooltip: 'Tire dúvidas conceituais, prazos e códigos tributários a qualquer hora',
          simples: true,
          presumido: true,
          real: true,
        },
      ],
    },
    {
      category: 'Serviços Fiscais & Contábeis',
      rows: [
        {
          feature: 'Cálculo de Guia DAS / Impostos Principais',
          tooltip: 'Emissão mensal das guias municipais, estaduais e federais',
          simples: true,
          presumido: true,
          real: true,
        },
        {
          feature: 'Aprovação e validação por contador com CRC',
          tooltip: 'Nossa equipe técnica revisa e valida todos os lançamentos',
          simples: true,
          presumido: true,
          real: true,
        },
        {
          feature: 'Emissão de Certidões Negativas de Débitos (CND)',
          tooltip: 'Monitoramento da regularidade fiscal perante Receita, FGTS e Fazenda',
          simples: 'Mensal',
          presumido: 'Contínuo',
          real: 'Contínuo & Prioritário',
        },
        {
          feature: 'Escrituração de SPED (EFD Contribuições, ICMS/IPI)',
          tooltip: 'Obrigações acessórias complexas exigidas pelo Fisco',
          simples: false,
          presumido: true,
          real: true,
        },
        {
          feature: 'LALUR / LACS e Balancetes de Suspensão',
          tooltip: 'Livros de apuração real do Imposto de Renda e CSLL',
          simples: false,
          presumido: false,
          real: true,
        },
        {
          feature: 'Relatório Mensal e DRE Executivo com PDF',
          tooltip: 'Demonstrativos gerenciais para apresentação a bancos e investidores',
          simples: true,
          presumido: true,
          real: true,
        },
      ],
    },
    {
      category: 'Departamento Pessoal & Folha',
      rows: [
        {
          feature: 'Emissão de pró-labore de sócios',
          tooltip: 'Cálculo de INSS, IRRF e emissão dos recibos mensais',
          simples: 'Até 2 sócios',
          presumido: 'Até 5 sócios',
          real: 'Ilimitado',
        },
        {
          feature: 'Folha de pagamento de colaboradores',
          tooltip: 'Holerites, FGTS Digital, rescisões e férias calculados',
          simples: 'Até 3 funcionários',
          presumido: 'Até 15 funcionários',
          real: 'Sob medida',
        },
        {
          feature: 'Transmissão eSocial e DCTFWeb',
          tooltip: 'Conformidade trabalhista em tempo real',
          simples: true,
          presumido: true,
          real: true,
        },
      ],
    },
    {
      category: 'Atendimento & Assessoria Consultiva',
      rows: [
        {
          feature: 'Canal de atendimento principal',
          tooltip: 'Canais humanos dedicados ao seu negócio',
          simples: 'Portal + WhatsApp',
          presumido: 'WhatsApp + Chamada de Vídeo',
          real: 'Contador Sênior Dedicado 24/7',
        },
        {
          feature: 'SLA de resposta para dúvidas',
          tooltip: 'Tempo de retorno garantido em dias úteis',
          simples: 'Até 2 horas úteis',
          presumido: 'Até 1 hora útil',
          real: 'Imediato / < 30 min',
        },
        {
          feature: 'Planejamento Tributário Anual',
          tooltip: 'Estudo para reduzir a carga de impostos legalmente',
          simples: 'Anual básico',
          presumido: 'Semestral aprofundado',
          real: 'Trimestral executivo',
        },
        {
          feature: 'Taxa de migração / abertura de empresa',
          tooltip: 'Honorários de abertura ou transferência de contabilidade',
          simples: 'Grátis (R$ 0)',
          presumido: 'Grátis (R$ 0)',
          real: 'Grátis (R$ 0)',
        },
      ],
    },
  ]

  const renderCellValue = (val: boolean | string) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
          <Check className="w-4 h-4 stroke-[2.5]" />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-500">
          <X className="w-4 h-4" />
        </span>
      )
    }
    return <span className="font-semibold text-slate-200 text-xs sm:text-sm">{val}</span>
  }

  return (
    <TooltipProvider>
      <section id="planos" className="py-24 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs font-semibold px-3 py-1">
              <Zap className="w-3.5 h-3.5 mr-1 text-amber-400 inline" />
              Preços Claros &bull; Sem Entrelinhas
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Planos desenhados para cada momento da sua empresa
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Mensalidades justas, sem taxas ocultas e com migração 100% gratuita. Compare lado a
              lado o que está incluído em cada plano contábil.
            </p>

            {/* Billing cycle toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 mt-2">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Anual</span>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  -15% OFF
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((p) => {
              const IconComp = p.icon
              const price = billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly

              return (
                <div
                  key={p.id}
                  className={`rounded-2xl p-7 flex flex-col justify-between transition-all relative ${
                    p.popular
                      ? 'bg-slate-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-[1.02] z-10'
                      : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-slate-950" />
                      Mais Escolhido por PMEs
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                          {p.id.toUpperCase()}
                        </Badge>
                      </div>

                      <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                      <p className="text-xs text-slate-400 min-h-[32px]">{p.tag}</p>
                    </div>

                    {/* Price display */}
                    <div className="pt-2 pb-1 border-y border-slate-800">
                      {price !== null ? (
                        <div>
                          <div className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
                            A partir de
                          </div>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                              R$ {price}
                            </span>
                            <span className="text-xs text-slate-400">{p.period}</span>
                          </div>
                          {billingCycle === 'annual' && (
                            <p className="text-[11px] text-emerald-300 mt-1 font-medium">
                              Cobrado anualmente (economia de R${' '}
                              {(p.priceMonthly! - p.priceAnnual!) * 12}/ano)
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                            Sob Medida
                          </div>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                              Sob Consulta
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Diagnóstico fiscal prévio 100% gratuito
                          </p>
                        </div>
                      )}

                      <p className="text-[11px] text-slate-400 mt-2 italic leading-tight">
                        {p.disclaimer}
                      </p>
                    </div>

                    {/* Feature highlights list */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Destaques deste plano:
                      </p>
                      <ul className="space-y-2.5">
                        {p.topHighlights.map((feat) => (
                          <li
                            key={feat}
                            className="flex items-start gap-2.5 text-xs text-slate-300"
                          >
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA button */}
                  <div className="pt-8">
                    <a href="#contratar">
                      <Button
                        type="button"
                        onClick={() => onSelectPlan(p.leadRegime)}
                        className={`w-full font-bold h-12 text-sm shadow-md gap-2 ${
                          p.popular
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        }`}
                      >
                        <span>Contratar {p.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                    <p className="text-[10px] text-slate-500 text-center mt-2">
                      Sem taxa de matrícula &bull; Sem fidelidade abusiva
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Full Comparison Table Section */}
          <div className="space-y-6 pt-10">
            <div className="text-center space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Tabela Comparativa Completa
              </h3>
              <p className="text-sm text-slate-400">
                Veja item a item o que cada regime tributário recebe no Portal da Golden
              </p>
            </div>

            {/* Desktop / Tablet comparative table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[720px]">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800">
                      <th className="p-4 sm:p-5 text-sm font-bold text-white w-2/5">
                        Funcionalidades & Entregas
                      </th>
                      <th className="p-4 sm:p-5 text-center text-sm font-bold text-white w-1/5">
                        <span className="block text-emerald-400">Simples Nacional</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          a partir de R$ 149/mês
                        </span>
                      </th>
                      <th className="p-4 sm:p-5 text-center text-sm font-bold text-white w-1/5">
                        <span className="block text-teal-400">Lucro Presumido</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          a partir de R$ 249/mês
                        </span>
                      </th>
                      <th className="p-4 sm:p-5 text-center text-sm font-bold text-white w-1/5">
                        <span className="block text-amber-400">Lucro Real</span>
                        <span className="text-[11px] font-normal text-slate-400">Sob Consulta</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {comparisonCategories.map((cat, idx) => (
                      <>
                        <tr
                          key={`cat-${idx}`}
                          className="bg-slate-900/60 border-y border-slate-800/80"
                        >
                          <td
                            colSpan={4}
                            className="p-3 px-5 text-xs font-bold uppercase tracking-wider text-emerald-400"
                          >
                            {cat.category}
                          </td>
                        </tr>
                        {cat.rows.map((row, rIdx) => (
                          <tr
                            key={`row-${rIdx}`}
                            className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-colors"
                          >
                            <td className="p-4 px-5 text-xs sm:text-sm text-slate-200">
                              <div className="flex items-center gap-1.5">
                                <span>{row.feature}</span>
                                {row.tooltip && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-help text-slate-500 hover:text-slate-300">
                                        <HelpCircle className="w-3.5 h-3.5" />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 text-white border-slate-800 text-xs max-w-xs">
                                      {row.tooltip}
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center">{renderCellValue(row.simples)}</td>
                            <td className="p-4 text-center">{renderCellValue(row.presumido)}</td>
                            <td className="p-4 text-center">{renderCellValue(row.real)}</td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table footer with quick CTA */}
              <div className="p-4 sm:p-6 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Dúvidas sobre qual o melhor regime para pagar menos impostos? Nossa equipe faz o
                    enquadramento ideal.
                  </span>
                </div>
                <a href="#contratar">
                  <Button
                    onClick={() => onSelectPlan('nao_sei')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-5"
                  >
                    Fazer Diagnóstico Tributário Gratuito
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}
