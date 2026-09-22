import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Bot,
  Scale,
  Calculator,
  UserCheck,
  FileCheck2,
  TrendingUp,
  Clock,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Briefcase,
  Layers,
  FileText,
  Lock,
  Headphones,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingSocialProof } from '@/components/landing/LandingSocialProof'

export default function PublicHome() {
  const navigate = useNavigate()

  const handleSelectPlan = (regime: string = 'simples') => {
    navigate(`/contratar?regime=${regime}`)
  }

  const differentials = [
    {
      icon: UserCheck,
      badge: 'Atendimento Consultivo',
      title: 'Contador Sênior Dedicado',
      desc: 'Um profissional com registro ativo no CRC-SP acompanha sua empresa de ponta a ponta. Sem robôs impessoais quando você mais precisa.',
    },
    {
      icon: Bot,
      badge: 'Tecnologia Proprietária',
      title: 'IA de Triagem e Auditoria',
      desc: 'Algoritmo treinado em mais de 2.000 padrões fiscais brasileiros que classifica notas, DAS, DARFs e holerites com precisão de 98.4%.',
    },
    {
      icon: ShieldCheck,
      badge: 'Zero Multas',
      title: 'Compliance e Blindagem Fiscal',
      desc: 'Calendário com semáforo de vencimentos e alertas automáticos antes do prazo legal. Sua empresa protegida contra multas do Fisco.',
    },
    {
      icon: Headphones,
      badge: 'SLA Rápido',
      title: 'Suporte Humano em até 15 Minutos',
      desc: 'Canais ágeis via WhatsApp corporativo, telefone e portal em nuvem com histórico de conversas e solicitações gravado.',
    },
    {
      icon: Calculator,
      badge: 'Economia Real',
      title: 'Planejamento Tributário Contínuo',
      desc: 'Análise contínua do enquadramento (Simples Nacional vs. Lucro Presumido vs. Lucro Real) para reduzir impostos 100% dentro da lei.',
    },
    {
      icon: Lock,
      badge: 'LGPD & Segurança',
      title: 'Infraestrutura em Nuvem Criptografada',
      desc: 'Isolamento de dados por empresa, rate limits contra acessos não autorizados e rastreabilidade total de cada documento.',
    },
  ]

  const coreServices = [
    {
      icon: Calculator,
      title: 'Contabilidade Completa & Fiscal',
      summary: 'Gestão contábil e fiscal de ponta a ponta para PMEs e grandes operações.',
      items: [
        'Apuração mensal de tributos (DAS, IRPJ, CSLL, PIS/COFINS, ISS, ICMS)',
        'Balancetes, Balanço Patrimonial e DRE executiva com exportação em PDF',
        'Emissão contínua de CND (Certidões Negativas Federais, Estaduais e Municipais)',
        'Entrega de obrigações acessórias (SPED Fiscal, EFD Contribuições, DEFIS, ECD, ECF)',
      ],
      priceHint: 'A partir de R$ 149/mês',
      regimeTarget: 'simples',
    },
    {
      icon: Users,
      title: 'Departamento Pessoal & Folha de Pagamento',
      summary: 'Tranquilidade trabalhista com envio pontual ao eSocial e DCTFWeb.',
      items: [
        'Cálculo e emissão de holerites, pró-labore de sócios e guias FGTS Digital / INSS',
        'Controle de férias, 13º salário, admissões e rescisões contratuais',
        'Conexão nativa eSocial para garantir total conformidade com a CLT',
        'Avisos preventivos aos colaboradores e gestores financeiros',
      ],
      priceHint: 'Incluso nos planos a partir de 1 colaborador',
      regimeTarget: 'presumido',
    },
    {
      icon: Building2,
      title: 'Abertura & Legalização de Empresas',
      summary: 'Tire sua empresa do papel sem burocracia ou migre de contador gratuitamente.',
      items: [
        'Abertura de CNPJ 100% digital e sem custos de honorários da Golden',
        'Enquadramento societário estratégico (SLU, LTDA, S/A) e regime ideal',
        'Inscrição Municipal, Estadual, alvarás e licenças necessárias',
        'Migração de contador simplificada com auditoria inicial sem custo',
      ],
      priceHint: 'Honorários de abertura/migração R$ 0',
      regimeTarget: 'simples',
    },
    {
      icon: Scale,
      title: 'Consultoria Tributária & Lucro Real',
      summary: 'Diagnóstico aprofundado para operações com alta complexidade e margem reduzida.',
      items: [
        'Apuração por Balancete de Redução/Suspensão e LALUR/LACS eletrônico',
        'Auditoria preventiva de créditos tributários sobre insumos e insumos de PIS/COFINS',
        'Reunião mensal executiva com contadores seniores e diretoria',
        'Assessoria em reorganizações societárias, cisões e fusões',
      ],
      priceHint: 'Proposta sob consulta com diagnóstico gratuito',
      regimeTarget: 'real',
    },
  ]

  const teamLeadership = [
    {
      name: 'Paulo César "Paulinho"',
      role: 'Sócio-Diretor & Contador Responsável Técnico',
      crc: 'CRC-SP 2SP034891/O',
      bio: 'Especialista em Gestão Tributária e Direito Empresarial com mais de 18 anos de experiência liderando a contabilidade de empresas dos setores de serviços, tecnologia, clínicas e indústria.',
      initials: 'PC',
    },
    {
      name: 'Mariana Duarte',
      role: 'Supervisora de Departamento Pessoal & eSocial',
      crc: 'Especialista em Compliance Trabalhista',
      bio: 'Mais de 12 anos atuando na gestão de folhas de pagamento complexas, parametrização do eSocial, medicina e segurança do trabalho e rotinas sindicais.',
      initials: 'MD',
    },
    {
      name: 'Renato Fogaça',
      role: 'Líder de Planejamento Tributário & Lucro Real',
      crc: 'Especialista IFRS & SPED',
      bio: 'Auditor fiscal e consultor sênior com foco em recuperação legítima de créditos tributários, LALUR/LACS e desenho de estruturas para redução legal de carga tributária.',
      initials: 'RF',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Navbar Pública Consistente */}
      <LandingNavbar onSelectPlanCta={handleSelectPlan} />

      <main>
        {/* 2. Hero Institucional Golden */}
        <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-4 w-[420px] h-[420px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold shadow-inner">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Golden Contabilidade &bull; Portal Contábil Integrado</span>
                <span className="hidden sm:inline text-emerald-300/60">&bull;</span>
                <span className="hidden sm:inline text-amber-300 font-medium">
                  CRC-SP 2SP034891/O
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                A contabilidade que une a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  precisão da IA
                </span>{' '}
                ao olhar consultivo de contadores seniores.
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Fundada para transformar a relação entre empresas e o Fisco, a{' '}
                <strong>Golden Contabilidade</strong> oferece atendimento humanizado com SLA ágil,
                esteira de triagem inteligente, calendário fiscal sem multas e relatórios executivos
                em nuvem.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link to="/planos" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 h-12 shadow-lg shadow-emerald-600/30 gap-2 text-base"
                  >
                    <span>Conhecer Planos & Preços</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <Link to="/contratar" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700 px-6 h-12 text-sm sm:text-base font-semibold gap-2"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Solicitar Proposta Gratuita</span>
                  </Button>
                </Link>

                <Link to="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full sm:w-auto text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 px-5 h-12 text-sm sm:text-base font-semibold gap-2"
                  >
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Área do Cliente</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs text-slate-400 border-t border-slate-800/60 mt-8">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">Registro Ativo no CRC-SP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">Migração de Contador sem Custo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">Atendimento em até 15 Minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">
                    Dados 100% em Conformidade LGPD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Social Proof & Números da Golden */}
        <LandingSocialProof />

        {/* 4. Quem Somos & Missão */}
        <section className="py-24 bg-slate-900/70 border-b border-slate-800 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Story & Mission */}
              <div className="lg:col-span-7 space-y-6">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-semibold px-3 py-1">
                  <Building2 className="w-3.5 h-3.5 mr-1 text-emerald-400 inline" />
                  Quem Somos &bull; Golden Contabilidade
                </Badge>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Mais do que emitir guias: somos o parceiro estratégico do seu crescimento.
                </h2>

                <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    A Golden Contabilidade nasceu da insatisfação com os dois extremos do mercado
                    contábil: de um lado, os escritórios tradicionais e lentos, afogados em papel e
                    sem transparência; do outro, as plataformas puramente digitais automatizadas
                    onde você é apenas um número de chamado e não consegue falar com um contador
                    quando precisa.
                  </p>
                  <p>
                    Construímos o <strong>Portal Contábil Integrado</strong> para unir o melhor dos
                    dois mundos: uma infraestrutura de software de alta performance com inteligência
                    artificial para eliminar retrabalho, somada à atenção atenta de contadores
                    especialistas que conhecem as especificidades do seu negócio pelo nome.
                  </p>
                </div>

                {/* 3 Pillars: Mission, Vision, Values */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      Missão
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Blindar empresas brasileiras contra passivos fiscais e trabalhistas,
                      proporcionando clareza financeira e economia tributária contínua.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      Visão
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Ser a principal referência em contabilidade consultiva e tecnológica do
                      Brasil, unindo contabilidade humana à IA aplicada.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                      Valores
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Transparência radical, rigor técnico absoluto (CRC), inovação útil e
                      compromisso inegociável com o sucesso do cliente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual highlights card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-8 border border-slate-800 shadow-2xl space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg">
                    <Award className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white">Números que Comprovam</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Resultados consolidados em nossa operação diária
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div>
                        <p className="text-2xl font-extrabold text-white font-mono">+120</p>
                        <p className="text-xs text-slate-400">Empresas ativas e auditadas</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-0">
                        Simples / Presumido / Real
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div>
                        <p className="text-2xl font-extrabold text-white font-mono">100%</p>
                        <p className="text-xs text-slate-400">
                          Prazos fiscais cumpridos sem multas
                        </p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-0">
                        Conformidade
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div>
                        <p className="text-2xl font-extrabold text-white font-mono">&lt; 15 min</p>
                        <p className="text-xs text-slate-400">Tempo médio de retorno humano</p>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-300 border-0">SLA Ágil</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div>
                        <p className="text-2xl font-extrabold text-white font-mono">R$ 0</p>
                        <p className="text-xs text-slate-400">
                          Taxa de migração ou adesão de plano
                        </p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-0">
                        Gratuito
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link to="/institucional#funcionalidades">
                      <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs h-10 gap-2">
                        <span>Ver as 12 Funcionalidades do Portal</span>
                        <ChevronRight className="w-4 h-4 text-emerald-400" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Nossos 6 Diferenciais Competitivos */}
        <section className="py-24 bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs font-semibold px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400 inline" />
                Diferenciais da Golden
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Por que as empresas escolhem a Golden?
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Combinamos tecnologia avançada de triagem a contadores seniores comprometidos com a
                saúde financeira do seu negócio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {differentials.map((item, idx) => {
                const IconComponent = item.icon
                return (
                  <Card
                    key={idx}
                    className="border border-slate-800 bg-slate-900/70 hover:bg-slate-900 hover:border-emerald-500/50 transition-all rounded-2xl group flex flex-col justify-between"
                  >
                    <CardContent className="p-7 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                          {item.badge}
                        </Badge>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* 6. Serviços Oferecidos em Detalhes */}
        <section className="py-24 bg-slate-900/60 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-semibold px-3 py-1">
                <Briefcase className="w-3.5 h-3.5 mr-1 text-emerald-400 inline" />
                Soluções Completas
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Serviços contábeis desenhados para cada fase do seu negócio
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Da abertura do CNPJ à apuração fiscal de grandes estruturas corporativas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {coreServices.map((srv, idx) => {
                const IconComponent = srv.icon
                return (
                  <Card
                    key={idx}
                    className="border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all rounded-2xl flex flex-col justify-between"
                  >
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-400 font-mono">
                          {srv.priceHint}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">{srv.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {srv.summary}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          O que está incluso:
                        </p>
                        <ul className="space-y-2 text-xs text-slate-300">
                          {srv.items.map((it, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>

                    <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-4">
                      <Link
                        to={`/contratar?regime=${srv.regimeTarget}`}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 group"
                      >
                        <span>Contratar este serviço</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        to="/planos"
                        className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        Comparar planos
                      </Link>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* 7. Liderança Técnica / Equipe */}
        <section className="py-24 bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs font-semibold px-3 py-1">
                <Users className="w-3.5 h-3.5 mr-1 text-amber-400 inline" />
                Corpo Técnico
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Profissionais experientes cuidando do seu CNPJ
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Conheça a liderança contábil responsável técnica por auditar seus balanços e
                garantir conformidade perante a Receita Federal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamLeadership.map((member, idx) => (
                <Card
                  key={idx}
                  className="border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-all rounded-2xl overflow-hidden"
                >
                  <CardContent className="p-7 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-extrabold text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                        {member.initials}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">
                          {member.name}
                        </h3>
                        <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                          {member.role}
                        </p>
                        <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] mt-1 font-mono">
                          {member.crc}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Call to Action Principal (Conectar a Planos e Contratação) */}
        <section className="py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-semibold px-4 py-1.5">
              <Sparkles className="w-4 h-4 mr-1.5 text-emerald-400 inline" />
              Migração Gratuita &bull; Sem Multas &bull; Contrato Sem Fidelidade
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Pronto para ter a tranquilidade contábil que a sua empresa merece?
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Solicite uma proposta personalizada em menos de 2 minutos ou compare nossos planos. Se
              já for cliente, acesse o portal com suas credenciais.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/contratar" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 h-12 shadow-xl shadow-emerald-600/30 gap-2 text-base"
                >
                  <span>Solicitar Proposta Agora</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link to="/planos" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700 px-7 h-12 text-sm sm:text-base font-semibold"
                >
                  <span>Ver Tabela de Planos</span>
                </Button>
              </Link>

              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-emerald-300 border-slate-700 px-6 h-12 text-sm sm:text-base font-semibold gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Entrar no Portal</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Footer Completo */}
      <LandingFooter />
    </div>
  )
}
