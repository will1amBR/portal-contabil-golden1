import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Calendar,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Star,
  Users,
  Award,
  Zap,
  Lock,
  MessageSquare,
  HelpCircle,
  Loader2,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createLead } from '@/services/api'
import { useToast } from '@/hooks/use-toast'

export default function LandingPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Lead form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    cnpj: '',
    tax_regime: 'simples',
    employees_count: '1-10',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email) {
      toast({
        title: 'Preencha os campos obrigatórios',
        description: 'Informe pelo menos seu nome e e-mail corporativo.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      await createLead({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company_name: formData.company_name.trim(),
        cnpj: formData.cnpj.trim(),
        tax_regime: formData.tax_regime,
        employees_count: formData.employees_count,
        message: formData.message.trim(),
      })

      setSubmitted(true)
      toast({
        title: 'Proposta solicitada com sucesso!',
        description:
          'Nossa equipe contábil recebeu seus dados e entrará em contato em breve por e-mail e WhatsApp!',
      })
    } catch (err: any) {
      const isRateLimited = err?.status === 429 || err?.response?.code === 429
      if (isRateLimited) {
        toast({
          title: 'Muitas solicitações enviadas',
          description:
            err?.response?.message ||
            'Por segurança anti-spam, aguarde alguns minutos antes de enviar nova mensagem.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro ao enviar solicitação',
          description:
            err?.response?.message ||
            err?.message ||
            'Tente novamente ou envie um e-mail para contato@golden.com.br',
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Sparkles,
      title: 'Triagem & Classificação com IA',
      desc: 'Envie seus documentos em lote por drag & drop. Nossa IA identifica se é DAS, DARF, folha ou contrato e encaminha para validação do contador.',
      badge: 'Inovação',
    },
    {
      icon: Calendar,
      title: 'Calendário de Obrigações Fiscais',
      desc: 'Adequado exatamente ao seu regime tributário (Simples, Presumido ou Real). Notificações de vencimento com sino no portal e por e-mail.',
      badge: 'Zero Multas',
    },
    {
      icon: ShieldCheck,
      title: 'Compliance Fiscal & Blindagem',
      desc: 'Histórico auditável de todas as guias pagas, certidões negativas em dia e validação em dois níveis pelos nossos contadores seniores.',
      badge: 'Segurança',
    },
    {
      icon: BarChart3,
      title: 'Relatórios Mensais Executivos',
      desc: 'DRE gerencial, balancetes consolidados, demonstrativo de impostos e faturamento gerados em PDF para apoio às decisões estratégicas.',
      badge: 'Gestão Ágil',
    },
    {
      icon: MessageSquare,
      title: 'Assistente IA & Suporte Consultivo',
      desc: 'Tire dúvidas tributárias 24/7 com nossa inteligência contábil e conte com contadores dedicados para seu negócio.',
      badge: '24/7',
    },
    {
      icon: Lock,
      title: 'Portal Integrado 100% em Nuvem',
      desc: 'Acesso seguro por múltiplos usuários, criptografia de ponta a ponta e aplicativo responsivo para desktop e smartphone.',
      badge: 'Cloud',
    },
  ]

  const stats = [
    { value: '100%', label: 'Conformidade nos Prazos Fiscais' },
    { value: '98.4%', label: 'Precisão na Triagem com IA' },
    { value: '+120', label: 'Empresas Atendidas com Sucesso' },
    { value: '15 min', label: 'Tempo Médio de Resposta' },
  ]

  const plans = [
    {
      name: 'Simples Nacional',
      subtitle: 'Ideal para prestadores de serviços, tecnologia e comércio',
      price: 'R$ 299',
      period: '/mês',
      popular: true,
      features: [
        'Acesso Completo ao Portal Integrado',
        'Upload em Lote com Triagem por IA',
        'Cálculo e Emissão de Guia DAS',
        'Folha de Pagamento até 5 funcionários',
        'Calendário de Obrigações com Alertas',
        'Relatório Mensal e DRE em PDF',
        'Suporte por Chat com Assistente IA + Contador',
      ],
    },
    {
      name: 'Lucro Presumido',
      subtitle: 'Para empresas em expansão com faturamento estruturado',
      price: 'R$ 599',
      period: '/mês',
      popular: false,
      features: [
        'Tudo do Plano Simples Nacional',
        'Apuração Trimestral IRPJ / CSLL',
        'Escriturações EFD, ECD e DCTFWeb',
        'Folha de Pagamento até 20 funcionários',
        'Planejamento Tributário Consultivo Semestral',
        'Conciliação Bancária Avançada',
        'Contador Dedicado via WhatsApp e Portal',
      ],
    },
    {
      name: 'Lucro Real / Corporativo',
      subtitle: 'Para indústrias, grandes operações e regimes especiais',
      price: 'Sob Consulta',
      period: '',
      popular: false,
      features: [
        'Toda a infraestrutura contábil enterprise',
        'Apuração Mensal por Balancete de Suspensão',
        'LALUR / LACS e SPEDs completos',
        'Auditoria Fiscal e Mitigação de Riscos',
        'Reuniões Mensais de Conselho Financeiro',
        'SLA Prioritário de Atendimento 24/7',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-300/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block">
                Golden Contabilidade
              </span>
              <span className="text-xs text-emerald-400 font-medium block">
                Portal Contábil Integrado
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#proposta" className="hover:text-emerald-400 transition-colors">
              Proposta de Valor
            </a>
            <a href="#funcionalidades" className="hover:text-emerald-400 transition-colors">
              Recursos
            </a>
            <a href="#planos" className="hover:text-emerald-400 transition-colors">
              Planos & Preços
            </a>
            <a href="#contratar" className="hover:text-emerald-400 transition-colors">
              Contratar
            </a>
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="outline"
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 text-xs sm:text-sm font-semibold"
              >
                Área do Cliente (Login)
              </Button>
            </Link>
            <a href="#contratar">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 gap-2">
                <span>Contratar Agora</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80">
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>
              A Contabilidade Consultiva do Futuro: Inteligência Artificial + Padrão Premium
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            A contabilidade da sua empresa no{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              piloto automático
            </span>{' '}
            e sem dor de cabeça.
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Centralize documentos com <strong>triagem por IA</strong>, receba guias de impostos em
            dia, acompanhe o calendário fiscal completo e tenha contadores experientes dedicados ao
            seu crescimento.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a href="#contratar">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 h-12 shadow-lg shadow-emerald-600/30 gap-2 text-base"
              >
                <span>Solicitar Proposta e Contratar</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700 px-8 h-12 text-base font-semibold"
              >
                <Lock className="w-4 h-4 mr-2 text-emerald-400" /> Acessar Portal Contábil
              </Button>
            </Link>
          </div>

          {/* Social proof logos / statement */}
          <div className="pt-12 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-1.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-slate-300 font-semibold ml-1">4.9/5 de Avaliação</span>
            </div>
            <span className="hidden sm:inline text-slate-700">&bull;</span>
            <span className="text-slate-300 font-medium">
              Utilizado por empresas de destaque como{' '}
              <strong className="text-white">Koren Ambiental LTDA</strong> e +120 clientes
            </span>
          </div>
        </div>
      </section>

      {/* Numerical Stats Banner */}
      <section className="py-12 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((st) => (
              <div key={st.label} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                  {st.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition / Features Section */}
      <section id="funcionalidades" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-semibold">
              Recursos de Ponta
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tudo o que sua empresa precisa para nunca mais se preocupar com o Fisco
            </h2>
            <p className="text-slate-400 text-base">
              A Golden Contabilidade combina alta tecnologia com o toque humano de contadores
              consultivos para garantir máxima conformidade tributária e redução legal de impostos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card
                key={f.title}
                className="border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-500/50 transition-all duration-200 shadow-md rounded-2xl group"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <f.icon className="w-6 h-6" />
                    </div>
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                      {f.badge}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {f.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Workflow Explainer */}
      <section id="proposta" className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white">Como Funciona a Parceria Golden</h2>
            <p className="text-slate-400 text-sm">
              Um fluxo claro, transparente e sem burocracia do início ao fim.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center">
                1
              </div>
              <h4 className="text-base font-bold text-white">Upload Ágil com IA</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Você envia guias, notas fiscais, contratos ou folhas de pagamento por lote. Nossa IA
                pré-classifica e já valida os campos essenciais.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center">
                2
              </div>
              <h4 className="text-base font-bold text-white">Validação & Apuração do Contador</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nossos contadores especialistas (como o Paulinho) conferem a conformidade, calculam
                os tributos e emitem as guias DAS, DARF ou folha.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center">
                3
              </div>
              <h4 className="text-base font-bold text-white">Calendário & Notificações Ativas</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Você recebe alertas no portal (sino no header) e por e-mail antes do vencimento.
                Nunca mais pague multas por esquecimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Plans Section */}
      <section id="planos" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs font-semibold">
              Transparência Total
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Planos Desenhados para a Realidade da sua Empresa
            </h2>
            <p className="text-slate-400 text-base">
              Sem taxas escondidas ou surpresas na mensalidade. Escolha o melhor pacote para seu
              porte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-8 flex flex-col justify-between transition-all relative ${
                  p.popular
                    ? 'bg-slate-900 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10'
                    : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    Mais Escolhido
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{p.subtitle}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono">{p.price}</span>
                    <span className="text-xs text-slate-400">{p.period}</span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      O que está incluso:
                    </p>
                    <ul className="space-y-2.5">
                      {p.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <a href="#contratar">
                    <Button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          tax_regime: p.name.includes('Presumido')
                            ? 'presumido'
                            : p.name.includes('Real')
                              ? 'real'
                              : 'simples',
                        }))
                      }
                      className={`w-full font-bold h-11 text-sm ${
                        p.popular
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      Contratar Plano {p.name}
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring & Contact Form Section */}
      <section
        id="contratar"
        className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-semibold">
                Contratação Rápida
              </Badge>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Migre sua contabilidade ou abra sua empresa com a Golden
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                Preencha o formulário ao lado com os dados básicos do seu negócio. Nossa equipe faz
                todo o processo de transição sem custo de adesão e sem interromper suas operações.
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">E-mail Comercial</p>
                    <p className="font-semibold text-white">contato@golden.com.br</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">WhatsApp / Telefone</p>
                    <p className="font-semibold text-white">
                      (11) 3456-7890 &bull; (11) 98765-4321
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Atendimento Consultivo</p>
                    <p className="font-semibold text-white">Segunda a Sexta, das 08h às 18h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <Card className="border border-slate-800 bg-slate-900/90 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8">
                  {submitted ? (
                    <div className="py-12 text-center space-y-4 animate-fade-in">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        Solicitação Recebida com Sucesso!
                      </h3>
                      <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                        Obrigado pelo interesse na <strong>Golden Contabilidade</strong>. Um de
                        nossos contadores especialistas já está analisando suas informações e
                        enviará a proposta personalizada para o e-mail{' '}
                        <strong>{formData.email}</strong>.
                      </p>
                      <div className="pt-4 flex justify-center gap-3">
                        <Button
                          onClick={() => {
                            setSubmitted(false)
                            setFormData({
                              name: '',
                              email: '',
                              phone: '',
                              company_name: '',
                              cnpj: '',
                              tax_regime: 'simples',
                              employees_count: '1-10',
                              message: '',
                            })
                          }}
                          variant="outline"
                          className="bg-slate-800 text-white border-slate-700 text-xs"
                        >
                          Enviar outra mensagem
                        </Button>
                        <Link to="/login">
                          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                            Ir para o Login
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Solicitar Proposta de Contratação
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Sem custo e sem compromisso. Resposta em até 2 horas úteis.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-300">
                            Nome Completo *
                          </Label>
                          <Input
                            required
                            placeholder="Ex: Carlos Silva"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-slate-950 border-slate-800 text-white h-10 text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-300">
                            E-mail Corporativo *
                          </Label>
                          <Input
                            type="email"
                            required
                            placeholder="carlos@empresa.com.br"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-slate-950 border-slate-800 text-white h-10 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-300">
                            Telefone / WhatsApp
                          </Label>
                          <Input
                            placeholder="(11) 98765-4321"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-slate-950 border-slate-800 text-white h-10 text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-300">
                            Nome da Empresa
                          </Label>
                          <Input
                            placeholder="Ex: Eco Solutions LTDA"
                            value={formData.company_name}
                            onChange={(e) =>
                              setFormData({ ...formData, company_name: e.target.value })
                            }
                            className="bg-slate-950 border-slate-800 text-white h-10 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-300">
                            CNPJ (se já tiver)
                          </Label>
                          <Input
                            placeholder="00.000.000/0001-00"
                            value={formData.cnpj}
                            onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                            className="bg-slate-950 border-slate-800 text-white h-10 text-sm font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-300">
                            Regime Tributário
                          </Label>
                          <Select
                            value={formData.tax_regime}
                            onValueChange={(v) => setFormData({ ...formData, tax_regime: v })}
                          >
                            <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-10 text-xs">
                              <SelectValue placeholder="Selecione o regime" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                              <SelectItem value="simples">Simples Nacional</SelectItem>
                              <SelectItem value="presumido">Lucro Presumido</SelectItem>
                              <SelectItem value="real">Lucro Real</SelectItem>
                              <SelectItem value="mei">MEI (Microempreendedor)</SelectItem>
                              <SelectItem value="nao_sei">Não sei / Quero orientação</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-300">
                          Mensagem ou Necessidade Específica
                        </Label>
                        <Textarea
                          rows={3}
                          placeholder="Conte-nos sobre sua empresa, volume de notas ou o que espera da contabilidade..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-white text-xs resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 text-sm shadow-md shadow-emerald-600/20 gap-2 mt-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Enviando solicitação...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Enviar e Receber Proposta</span>
                          </>
                        )}
                      </Button>

                      <p className="text-[11px] text-slate-500 text-center">
                        Seus dados estão protegidos de acordo com a LGPD e serão utilizados apenas
                        para elaboração da proposta.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-200">
                Golden Contabilidade &bull; CRC-SP 2SP034891/O
              </p>
              <p className="text-[11px]">Inteligência Fiscal & Gestão Integrada para Empresas</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-emerald-400 transition-colors">
              Área do Cliente
            </Link>
            <a href="#proposta" className="hover:text-emerald-400 transition-colors">
              Proposta
            </a>
            <a href="#planos" className="hover:text-emerald-400 transition-colors">
              Planos
            </a>
            <a href="#contratar" className="hover:text-emerald-400 transition-colors">
              Contato
            </a>
          </div>

          <p>
            &copy; {new Date().getFullYear()} Golden Contabilidade. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
