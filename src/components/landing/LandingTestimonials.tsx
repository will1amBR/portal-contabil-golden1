import { Star, Quote, Building2, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function LandingTestimonials() {
  const testimonials = [
    {
      author: 'William Koren',
      role: 'Diretor Geral',
      company: 'Koren Ambiental LTDA',
      segment: 'Engenharia & Gestão Ambiental',
      imageSeed: 12,
      rating: 5,
      content:
        'A organização dos documentos e o acompanhamento próximo do Paulo César e da equipe da Golden nos deram total previsibilidade fiscal. O calendário de obrigações com semáforo evita qualquer surpresa perante a Receita Federal.',
    },
    {
      author: 'Mariana Vasconcelos',
      role: 'Sócia-Administradora',
      company: 'Nexus Soluções Corporativas',
      segment: 'Tecnologia & Consultoria',
      imageSeed: 34,
      rating: 5,
      content:
        'Vínhamos de um escritório que demorava dias para esclarecer uma retenção na fonte. Na Golden, o atendimento por WhatsApp e telefone tem retorno em minutos, com clareza nos relatórios e honorários transparentes.',
    },
    {
      author: 'Rodrigo Mendonça',
      role: 'Diretor Financeiro (CFO)',
      company: 'Aliança Distribuidora',
      segment: 'Comércio Atacadista',
      imageSeed: 56,
      rating: 5,
      content:
        'A complexidade do Lucro Presumido, com EFD Contribuições e DCTFWeb, exige contadores seniores com rigor técnico. A Golden organizou todas as nossas certidões e balancetes para instituições bancárias com excelência.',
    },
  ]

  return (
    <section className="py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-[#faf8f5] text-amber-900 border-amber-600/30 text-xs font-semibold px-3 py-1">
            <Star className="w-3.5 h-3.5 mr-1 fill-amber-500 text-amber-600 inline" />
            Depoimentos Verificados
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight">
            A opinião de quem confia seu CNPJ à Golden
          </h2>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            Mais de 120 empresas confiam no nosso time contábil para garantir conformidade estrita e
            foco total no crescimento do negócio.
          </p>
        </div>

        {/* Testimonials cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <Card
              key={t.author}
              className="border border-stone-200 bg-[#faf8f5] hover:border-amber-400/60 hover:shadow-md transition-all rounded-2xl flex flex-col justify-between shadow-xs"
            >
              <CardContent className="p-7 space-y-5">
                {/* Stars and quote icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-stone-300" />
                </div>

                <p className="text-sm sm:text-base text-slate-800 leading-relaxed italic">
                  "{t.content}"
                </p>

                {/* Author Info com foto sóbria */}
                <div className="pt-4 border-t border-stone-200 flex items-center gap-3.5">
                  <img
                    src={`https://img.usecurling.com/ppl/medium?seed=${t.imageSeed}`}
                    alt={t.author}
                    className="w-11 h-11 rounded-xl object-cover border border-amber-300 shadow-2xs"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 leading-tight">{t.author}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {t.role} &bull; <strong className="text-slate-900">{t.company}</strong>
                    </p>
                    <p className="text-[11px] text-amber-800 font-semibold mt-0.5">{t.segment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Satisfaction metric banner */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-2 text-slate-950 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>NPS 89 &bull; Elevado Índice de Recomendação</span>
          </div>
          <span className="hidden sm:inline text-stone-300">&bull;</span>
          <span>Mais de 5.000 guias e demonstrativos fiscais apurados com rigor</span>
        </div>
      </div>
    </section>
  )
}
