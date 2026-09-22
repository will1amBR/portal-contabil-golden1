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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-700 selection:text-white">
      {/* 1. Navbar Pública Consistente */}
      <LandingNavbar onSelectPlanCta={handleSelectPlan} />

      <main>
        {/* 2. Hero Institucional Golden - Sólido e Elegante */}
        <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-slate-900 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Golden Contabilidade &bull; Portal Contábil Integrado</span>
                <span className="hidden sm:inline text-slate-500">&bull;</span>
                <span className="hidden sm:inline text-slate-200 font-medium">
                  CRC-SP 2SP034891/O
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-white leading-[1.18]">
                A contabilidade que une a solidez da tradição à eficiência da tecnologia
                contemporânea.
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed max-w-3xl mx-auto">
                Fundada para proporcionar segurança fiscal contínua aos empresários, a{' '}
                <strong>Golden Contabilidade</strong> oferece atendimento consultivo de alto nível,
                acompanhamento preventivo de prazos, triagem de notas fiscais e relatórios
                gerenciais claros.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
                <Link to="/planos" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-7 h-12 shadow-md shadow-amber-950/40 gap-2 text-base transition-all"
                  >
                    <span>Conhecer Planos & Tabela</span>
                    <ArrowRight className="w-5 h-5 text-slate-950" />
                  </Button>
                </Link>

                <Link to="/contratar" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-700 px-6 h-12 text-sm sm:text-base font-semibold gap-2"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Solicitar Proposta Comercial</span>
                  </Button>
                </Link>

                <Link to="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full sm:w-auto text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 px-5 h-12 text-sm sm:text-base font-semibold gap-2"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Área do Cliente</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-slate-300 border-t border-slate-800 mt-8">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200 font-medium">Registro Ativo no CRC-SP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200 font-medium">
                    Migração Sem Custo e Sem Paradas
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200 font-medium">Retorno Ágil em até 15 Minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200 font-medium">
                    Conformidade Rigorosa com a LGPD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Social Proof & Números da Golden */}
        <LandingSocialProof />

        {/* 4. Quem Somos & Missão */}
        <section className="py-24 bg-slate-900 border-b border-slate-800 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Story & Mission */}
              <div className="lg:col-span-7 space-y-6">
                <Badge className="bg-slate-950 text-amber-200 border-amber-500/30 text-xs font-semibold px-3 py-1">
                  <Building2 className="w-3.5 h-3.5 mr-1 text-amber-400 inline" />
                  Quem Somos &bull; Golden Contabilidade
                </Badge>

                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                  Mais do que emitir guias: somos o parceiro estratégico do seu patrimônio.
                </h2>

                <div className="space-y-4 text-slate-200 text-base leading-relaxed">
                  <p>
                    A Golden Contabilidade nasceu da percepção clara de uma lacuna no mercado: de um
                    lado, escritórios excessivamente burocráticos e lentos; de outro, plataformas
                    padronizadas sem atendimento individualizado, onde dúvidas estratégicas ficam
                    sem resposta.
                  </p>
                  <p>
                    Estruturamos nosso <strong>Portal Contábil Integrado</strong> para oferecer o
                    equilíbrio perfeito: a agilidade do upload digital e organização automática de
                    documentos com o olhar atento de contadores habilitados que conhecem os detalhes
                    da sua operação.
                  </p>
                </div>

                {/* 3 Pillars: Mission, Vision, Values */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                      Missão
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Proteger empresas contra passivos fiscais e trabalhistas, proporcionando
                      clareza contábil e economia tributária lícita.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                      Visão
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Ser a principal referência em contabilidade consultiva e confiável do país,
                      unindo a responsabilidade do CRC à tecnologia moderna.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                      Valores
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Transparência, rigor técnico irrestrito, integridade de dados e pontualidade
                      absoluta em cada entrega fiscal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual highlights card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-xl bg-slate-950 p-8 border border-slate-800 shadow-xl space-y-6">
                  <div className="w-12 h-12 rounded-lg bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white">Indicadores Auditados</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Resultados comprovados em nossa operação corporativa
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div>
                        <p className="text-2xl font-bold text-white font-mono">+120</p>
                        <p className="text-xs text-slate-300">Empresas ativas e auditadas</p>
                      </div>
                      <Badge className="bg-slate-950 text-slate-200 border-slate-700 text-xs">
                        Simples / Presumido / Real
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div>
                        <p className="text-2xl font-bold text-white font-mono">100%</p>
                        <p className="text-xs text-slate-300">
                          Prazos fiscais cumpridos sem multas
                        </p>
                      </div>
                      <Badge className="bg-slate-900 text-slate-100 border-slate-700 text-xs font-semibold">
                        Conformidade 100%
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div>
                        <p className="text-2xl font-bold text-white font-mono">&lt; 15 min</p>
                        <p className="text-xs text-slate-300">Tempo médio de retorno humano</p>
                      </div>
                      <Badge className="bg-amber-950/80 text-amber-300 border-amber-700 text-xs">
                        SLA Ágil
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div>
                        <p className="text-2xl font-bold text-white font-mono">R$ 0</p>
                        <p className="text-xs text-slate-300">
                          Taxa de migração ou adesão de contrato
                        </p>
                      </div>
                      <Badge className="bg-slate-950 text-slate-200 border-slate-700 text-xs">
                        Sem Custo
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link to="/institucional#funcionalidades">
                      <Button className="w-full bg-slate-900 hover:bg-slate-850 text-white border border-slate-700 text-xs sm:text-sm h-11 gap-2">
                        <span>Ver Funcionalidades do Portal</span>
                        <ChevronRight className="w-4 h-4 text-amber-400" />
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
              <Badge className="bg-slate-900 text-amber-200 border-amber-500/30 text-xs font-semibold px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400 inline" />
                Diferenciais da Golden
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Por que as empresas escolhem a Golden?
              </h2>
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Aliamos processos digitais seguros a contadores seniores comprometidos com a saúde
                financeira e tributária do seu negócio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {differentials.map((item, idx) => {
                const IconComponent = item.icon
                return (
                  <Card
                    key={idx}
                    className="border border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-all rounded-xl shadow-sm flex flex-col justify-between"
                  >
                    <CardContent className="p-7 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 flex items-center justify-center">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <Badge className="bg-slate-950 text-slate-200 border-slate-800 text-[11px]">
                          {item.badge}
                        </Badge>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
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
        <section className="py-24 bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <Badge className="bg-slate-950 text-amber-200 border-amber-500/30 text-xs font-semibold px-3 py-1">
                <Briefcase className="w-3.5 h-3.5 mr-1 text-amber-400 inline" />
                Soluções Completas
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Serviços contábeis desenhados para cada fase do seu negócio
              </h2>
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Da abertura do CNPJ à apuração fiscal de médias e grandes operações.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {coreServices.map((srv, idx) => {
                const IconComponent = srv.icon
                return (
                  <Card
                    key={idx}
                    className="border border-slate-800 bg-slate-950 hover:border-slate-700 transition-all rounded-xl flex flex-col justify-between shadow-sm"
                  >
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-lg bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-amber-300 font-mono">
                          {srv.priceHint}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">{srv.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                          {srv.summary}
                        </p>
                      </div>

                      <div className="space-y-2.5 pt-3 border-t border-slate-800">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          O que está incluso:
                        </p>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                          {srv.items.map((it, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>

                    <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-800 mt-4">
                      <Link
                        to={`/contratar?regime=${srv.regimeTarget}`}
                        className="text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1.5"
                      >
                        <span>Solicitar contratação</span>
                        <ArrowRight className="w-4 h-4 text-amber-400" />
                      </Link>
                      <Link
                        to="/planos"
                        className="text-xs text-slate-300 hover:text-white transition-colors"
                      >
                        Comparar planos &rarr;
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
              <Badge className="bg-slate-900 text-amber-200 border-amber-500/30 text-xs font-semibold px-3 py-1">
                <Users className="w-3.5 h-3.5 mr-1 text-amber-400 inline" />
                Corpo Técnico
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Profissionais experientes cuidando do seu CNPJ
              </h2>
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Conheça os profissionais responsáveis por auditar seus balanços e garantir
                conformidade perante a Receita Federal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamLeadership.map((member, idx) => (
                <Card
                  key={idx}
                  className="border border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-all rounded-xl overflow-hidden shadow-sm"
                >
                  <CardContent className="p-7 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-bold text-base flex items-center justify-center shrink-0">
                        {member.initials}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">
                          {member.name}
                        </h3>
                        <p className="text-xs text-amber-300 font-semibold mt-0.5">{member.role}</p>
                        <Badge className="bg-slate-950 text-slate-300 border-slate-800 text-[10px] mt-1 font-mono">
                          {member.crc}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-2 border-t border-slate-800">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Call to Action Principal (Conectar a Planos e Contratação) */}
        <section className="py-24 bg-slate-950 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
            <Badge className="bg-slate-900 text-amber-200 border-amber-500/30 text-xs font-semibold px-4 py-1.5">
              <Sparkles className="w-4 h-4 mr-1.5 text-amber-400 inline" />
              Migração Gratuita &bull; Sem Multas Abusivas &bull; Contrato Sem Pegadinhas
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Pronto para ter a segurança contábil que a sua empresa merece?
            </h2>

            <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Solicite uma proposta personalizada em menos de 2 minutos ou compare nossos planos. Se
              já for cliente, acesse o portal com suas credenciais.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/contratar" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-8 h-12 shadow-md shadow-amber-950/40 gap-2 text-base"
                >
                  <span>Solicitar Proposta Agora</span>
                  <ArrowRight className="w-5 h-5 text-slate-950" />
                </Button>
              </Link>

              <Link to="/planos" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-700 px-7 h-12 text-sm sm:text-base font-semibold"
                >
                  <span>Ver Tabela de Planos</span>
                </Button>
              </Link>

              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-700 px-6 h-12 text-sm sm:text-base font-semibold gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
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
