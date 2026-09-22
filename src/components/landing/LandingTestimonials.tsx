import { Star, Quote, Building2, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function LandingTestimonials() {
  const testimonials = [
    {
      author: 'William Koren',
      role: 'Diretor Geral',
      company: 'Koren Ambiental LTDA',
      segment: 'Engenharia & Soluções Ambientais',
      imageSeed: 12,
      rating: 5,
      content:
        'A triagem por IA economizou horas da nossa equipe financeira. O calendário com semáforo de vencimentos e o acompanhamento próximo do Paulinho e do time da Golden nos deram total tranquilidade fiscal. Nota dez.',
    },
    {
      author: 'Mariana Vasconcelos',
      role: 'Sócia-Fundadora',
      company: 'Nexus Softwares & Cloud',
      segment: 'Tecnologia da Informação & SaaS',
      imageSeed: 34,
      rating: 5,
      content:
        'Migramos de uma contabilidade tradicional que demorava 3 dias para responder um e-mail. Na Golden, temos o portal com upload em lote e respostas via WhatsApp em minutos. A clareza dos custos e honorários é exemplar.',
    },
    {
      author: 'Rodrigo Mendonça',
      role: 'Diretor Financeiro (CFO)',
      company: 'Aliança Distribuidora',
      segment: 'Comércio Atacadista',
      imageSeed: 56,
      rating: 5,
      content:
        'Operamos no Lucro Presumido e a complexidade de EFD e DCTFWeb sempre foi um gargalo. A Golden organizou todas as certidões, emitiu os relatórios em PDF para nossos bancos e reduziu nossos custos operacionais.',
    },
  ]

  return (
    <section className="py-24 bg-slate-900/40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs font-semibold px-3 py-1">
            <Star className="w-3.5 h-3.5 mr-1 fill-amber-400 text-amber-400 inline" />
            Depoimentos Verificados
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Quem usa a Golden, recomenda e não troca
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Mais de 120 empresas confiam no nosso Portal Contábil Integrado para focar no que
            realmente importa: faturar e crescer.
          </p>
        </div>

        {/* Testimonials cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <Card
              key={t.author}
              className="border border-slate-800 bg-slate-900/80 hover:border-emerald-500/40 transition-all rounded-2xl flex flex-col justify-between"
            >
              <CardContent className="p-7 space-y-5">
                {/* Stars and quote icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-emerald-500/20" />
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic">"{t.content}"</p>

                {/* Author Info */}
                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  <img
                    src={`https://img.usecurling.com/ppl/medium?seed=${t.imageSeed}`}
                    alt={t.author}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/40"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{t.author}</h4>
                    <p className="text-xs text-slate-400">
                      {t.role} &bull; <strong className="text-slate-300">{t.company}</strong>
                    </p>
                    <p className="text-[10px] text-emerald-400 font-medium">{t.segment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Satisfaction metric banner */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2 text-white font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>NPS 89 &bull; Excelência Contábil Comprovada</span>
          </div>
          <span className="hidden sm:inline text-slate-700">&bull;</span>
          <span>Mais de 5.000 guias de impostos emitidas e conferidas sem erro</span>
        </div>
      </div>
    </section>
  )
}
