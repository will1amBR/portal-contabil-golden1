import { useState } from 'react'
import {
  Sparkles,
  UploadCloud,
  CheckCheck,
  Calendar,
  BellRing,
  Mail,
  FileSpreadsheet,
  LineChart,
  Bot,
  UserCheck,
  ShieldCheck,
  Layers,
  ArrowRight,
  FileCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export function LandingFeaturesDelivery() {
  const [activeTab, setActiveTab] = useState('all')

  const deliveredFeatures = [
    {
      id: 'ai-categorization',
      category: 'automation',
      badge: 'IA Integrada',
      icon: Sparkles,
      title: 'Categorização Automática com IA',
      tagline: 'Impostos, holerites, contábeis e legais sem esforço manual',
      description:
        'Envie seus arquivos e nosso motor de IA analisa o conteúdo instantaneamente, sugerindo a pasta correta com confiança calculada. O contador confirma com um clique.',
      proof: 'Modelo treinado com mais de 2.000 padrões contábeis brasileiros.',
    },
    {
      id: 'bulk-upload',
      category: 'automation',
      badge: 'Produtividade',
      icon: UploadCloud,
      title: 'Upload em Lote com Drag & Drop',
      tagline: 'Suba dezenas de guias e notas de uma só vez',
      description:
        'Arraste múltiplos arquivos diretamente para o navegador. Cada documento recebe pré-categorização individual por IA e feedback visual de status.',
      proof: 'Suporta PDF, XLSX, DOCX, CSV e imagens de comprovantes.',
    },
    {
      id: 'accountant-validation',
      category: 'compliance',
      badge: 'Conformidade',
      icon: CheckCheck,
      title: 'Validação & Aprovação pelo Contador',
      tagline: 'Aprovação individual ou em lote por contadores seniores',
      description:
        'Duplo nível de segurança: o cliente envia, a IA sugere e a equipe da Golden (CRC ativo) audita e aprova em lote, garantindo conformidade fiscal absoluta.',
      proof: 'Rastreabilidade com data, hora e responsável técnico registrado.',
    },
    {
      id: 'tax-calendar',
      category: 'compliance',
      badge: 'Zero Atrasos',
      icon: Calendar,
      title: 'Calendário de Obrigações por Regime',
      tagline: 'Simples Nacional, Lucro Presumido e Lucro Real sob medida',
      description:
        'Semáforo visual inteligente com dias restantes para cada guia (DAS, DARF, FGTS, DCTFWeb, ECD, ECF). Acompanhe o que está pago, pendente ou agendado.',
      proof: 'Atualizado em tempo real conforme a legislação tributária brasileira.',
    },
    {
      id: 'notification-bell',
      category: 'communication',
      badge: 'Em Tempo Real',
      icon: BellRing,
      title: 'Sino de Alertas no Portal + Realtime',
      tagline: 'Notificações imediatas sobre vencimentos e aprovações',
      description:
        'Painel dinâmico no topo do portal com contador de pendências, status de processamento e avisos cruciais para o gestor financeiro da sua empresa.',
      proof:
        'Alimentado por websockets realtime Skip Cloud para atualização sem recarregar a tela.',
    },
    {
      id: 'email-reminders',
      category: 'communication',
      badge: 'Anti-Multa',
      icon: Mail,
      title: 'Lembretes Automáticos por E-mail',
      tagline: 'Avisos preventivos disparados antes de cada vencimento',
      description:
        'Robô de rotina que dispara alertas automáticos por e-mail com 5, 2 e 1 dia(s) de antecedência, incluindo link direto para download da guia.',
      proof: 'Integração com servidor SMTP seguro e log de entrega auditável.',
    },
    {
      id: 'monthly-report',
      category: 'reports',
      badge: 'Visão Executiva',
      icon: FileSpreadsheet,
      title: 'Relatório Mensal com Exportação PDF',
      tagline: 'Demonstrativos contábeis prontos para a diretoria e bancos',
      description:
        'Consolide faturamento, impostos apurados, movimentação de folha e certidões em relatórios executivos de alta fidelidade com impressão em PDF.',
      proof: 'Layout executivo padronizado aceito por instituições financeiras.',
    },
    {
      id: 'conversion-performance',
      category: 'reports',
      badge: 'Painel do Escritório',
      icon: LineChart,
      title: 'Métricas de Desempenho e Leads',
      tagline: 'Visão transparente do pipeline e da assertividade da IA',
      description:
        'Painel gerencial que mede a assertividade da IA (ajustes x confirmações) e acompanha o ciclo de vida dos clientes desde a primeira proposta.',
      proof: 'Indicadores de precisão acima de 98% no portal ativo.',
    },
    {
      id: 'chat-assistant',
      category: 'communication',
      badge: 'Atendimento 24/7',
      icon: Bot,
      title: 'Chat com Assistente IA Especializado',
      tagline: 'Tire dúvidas tributárias a qualquer hora do dia ou da noite',
      description:
        'Assistente de inteligência contábil conectado às normas vigentes para orientar sobre prazos, alíquotas, notas fiscais e orientações do dia a dia.',
      proof: 'Conexão nativa com agentes inteligentes Skip Cloud AI.',
    },
    {
      id: 'client-onboarding',
      category: 'compliance',
      badge: 'Experiência',
      icon: UserCheck,
      title: 'Onboarding Guiado do Cliente',
      tagline: 'Configuração assistida passo a passo no primeiro acesso',
      description:
        'Modal interativo de boas-vindas que orienta a conferência do CNPJ, regime tributário, upload do contrato social e envio dos documentos pendentes.',
      proof: 'Redução do tempo de integração da empresa de dias para minutos.',
    },
    {
      id: 'data-security',
      category: 'compliance',
      badge: 'LGPD & Blindagem',
      icon: ShieldCheck,
      title: 'Rate Limit & Isolamento por Empresa',
      tagline: 'Arquitetura com proteção anti-spam e regras de acesso restritas',
      description:
        'Cada empresa acessa exclusivamente seus próprios documentos. Proteção server-side contra ataques de força bruta, rate limit em formulários e trilhas de auditoria.',
      proof: 'Polícias de segurança em nível de banco de dados e criptografia de ponta a ponta.',
    },
    {
      id: 'integrated-ecosystem',
      category: 'automation',
      badge: 'Ecossistema 100%',
      icon: Layers,
      title: 'Ambiente Unificado Escritório & Cliente',
      tagline: 'Sem pontas soltas: documentos, impostos e suporte num só lugar',
      description:
        'Elimine a troca interminável de e-mails, anexos perdidos no WhatsApp e planilhas paralelas. Tudo fica centralizado com histórico permanente.',
      proof: 'Mais de 120 empresas operando sem falha de comunicação.',
    },
  ]

  const filteredFeatures =
    activeTab === 'all'
      ? deliveredFeatures
      : deliveredFeatures.filter((f) => f.category === activeTab)

  return (
    <section id="funcionalidades" className="py-24 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-semibold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-400 inline" />
            Entregas Reais &bull; Já Funcionando no Portal
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Tudo o que sua empresa recebe desde o primeiro dia
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Nada de promessas abstratas. Conheça as funcionalidades que os clientes da{' '}
            <strong>Golden Contabilidade</strong> já utilizam diariamente para manter suas empresas
            100% blindadas e em dia com o Fisco.
          </p>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex justify-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-2xl">
            <TabsList className="grid grid-cols-4 bg-slate-900 border border-slate-800 p-1 rounded-xl h-auto">
              <TabsTrigger
                value="all"
                className="text-xs sm:text-sm py-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg text-slate-300"
              >
                Todas (12)
              </TabsTrigger>
              <TabsTrigger
                value="automation"
                className="text-xs sm:text-sm py-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg text-slate-300"
              >
                IA & Automação
              </TabsTrigger>
              <TabsTrigger
                value="compliance"
                className="text-xs sm:text-sm py-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg text-slate-300"
              >
                Fiscal & Prazos
              </TabsTrigger>
              <TabsTrigger
                value="communication"
                className="text-xs sm:text-sm py-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg text-slate-300"
              >
                Alertas & Chat
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredFeatures.map((feat) => {
            const IconComponent = feat.icon
            return (
              <Card
                key={feat.id}
                className="border border-slate-800 bg-slate-900/70 hover:bg-slate-900 hover:border-emerald-500/50 transition-all duration-200 shadow-md rounded-2xl group flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Card top */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] font-medium">
                      {feat.badge}
                    </Badge>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-400/90 leading-snug">
                      {feat.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed">{feat.description}</p>
                </CardContent>

                {/* Proof footer inside card */}
                <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800/80 rounded-b-2xl text-[11px] text-slate-400 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{feat.proof}</span>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Bottom Banner callout */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Quer ver tudo isso funcionando na prática?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Acesse a área de demonstração ou solicite uma proposta personalizada para a sua
              empresa.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a href="#contratar">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer">
                <span>Solicitar Proposta Agora</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
