import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getDocuments,
  getCompanies,
  getTaxRegimesRequirements,
  type Document,
  type Company,
  type TaxRegimeRequirement,
} from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ValidationBadge } from '@/components/ValidationBadge'
import { DocumentUpload } from '@/components/DocumentUpload'
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
  BarChart3,
  Building2,
  Sparkles,
  Calendar,
  ShieldCheck,
  UploadCloud,
  FileCheck2,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import TaxObligationsCalendar from '@/components/TaxObligationsCalendar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export default function ClientDashboard() {
  const { user } = useAuth()
  const [docs, setDocs] = useState<Document[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [requirements, setRequirements] = useState<TaxRegimeRequirement[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const [d, c, r] = await Promise.all([
        getDocuments(),
        getCompanies(),
        getTaxRegimesRequirements(),
      ])
      setDocs(d)
      setCompanies(c)
      setRequirements(r)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('documents', () => {
    loadData()
  })
  useRealtime('companies', () => {
    loadData()
  })

  const pending = docs.filter((d) => d.validation_status === 'pending')
  const pendingConfirmation = docs.filter((d) => d.validation_status === 'pending_confirmation')
  const approved = docs.filter((d) => d.validation_status === 'approved')
  const rejected = docs.filter((d) => d.validation_status === 'rejected')

  const stats = [
    {
      label: 'Total Arquivados',
      value: docs.length,
      icon: FileText,
      color: 'text-slate-700 bg-slate-100',
      description: 'Documentos na base',
    },
    {
      label: 'Triagem IA',
      value: pendingConfirmation.length,
      icon: Sparkles,
      color: 'text-indigo-700 bg-indigo-50 border border-indigo-100',
      description: 'Aguardando contador',
    },
    {
      label: 'Em Validação',
      value: pending.length,
      icon: Clock,
      color: 'text-amber-700 bg-amber-50 border border-amber-100',
      description: 'Análise contábil',
    },
    {
      label: 'Aprovados',
      value: approved.length,
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border border-emerald-100',
      description: 'Em conformidade',
    },
    {
      label: 'Rejeitados',
      value: rejected.length,
      icon: XCircle,
      color: 'text-red-700 bg-red-50 border border-red-100',
      description: 'Requerem reenvio',
    },
  ]

  const recent = [...docs]
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conformidade Contábil &bull; Golden Contabilidade</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Olá, {user?.name || 'Cliente'}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Acompanhe aqui suas obrigações fiscais, envio de guias e relatórios de conformidade em
              tempo real.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DocumentUpload
              companies={companies}
              onSuccess={loadData}
              buttonLabel="Enviar Novo Arquivo"
            />
            <Link to="/relatorios">
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2"
              >
                <BarChart3 className="w-4 h-4 text-emerald-400" /> Relatório Mensal
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem(`onboarding_completed_${user?.name || 'client'}`)
                window.location.reload()
              }}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 gap-1.5 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" /> Rever Onboarding
            </Button>
          </div>{' '}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border border-slate-200/80 shadow-xs bg-white">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{s.description}</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calendário de Obrigações Fiscais */}
      <TaxObligationsCalendar companies={companies} requirements={requirements} />

      {/* Documentos Recentes & Ações Rápidas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Histórico Recente de Documentos</h2>
            <p className="text-xs text-slate-500">
              Últimos arquivos processados pela equipe contábil.
            </p>
          </div>
          <Link
            to="/cliente/documentos"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            Ver todos ({docs.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <Card className="border border-slate-200 shadow-xs bg-white">
            <CardContent className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Nenhum documento enviado ainda</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                Envie suas guias fiscais, folhas de pagamento ou contratos para validação pela
                contabilidade.
              </p>
              <DocumentUpload companies={companies} onSuccess={loadData} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {recent.map((doc) => (
              <Card
                key={doc.id}
                className="border border-slate-200/90 shadow-xs bg-white hover:border-emerald-300 transition-colors"
              >
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-900 text-sm truncate">{doc.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Enviado em {format(parseISO(doc.created), 'dd/MM/yyyy HH:mm')} &bull;{' '}
                        {doc.expand?.company?.name || 'Tech Solutions'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <ValidationBadge status={doc.validation_status || 'pending'} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
