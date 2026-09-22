import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  getDocuments,
  getCompanies,
  getTaxRegimesRequirements,
  getNotificationReminders,
  confirmDocument,
  bulkConfirmDocuments,
  approveDocument,
  triggerRemindersCheck,
  getLeads,
  type Document,
  type Company,
  type TaxRegimeRequirement,
  type NotificationReminder,
  type Lead,
} from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  BarChart3,
  Building2,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Receipt,
  ClipboardCheck,
  Calendar,
  AlertTriangle,
  Mail,
  Send,
  Check,
  CheckCheck,
  ChevronRight,
  Filter,
  RefreshCw,
  TrendingUp,
  FileCheck2,
  FolderSync,
  ExternalLink,
  Layers,
  ArrowUpRight,
  Loader2,
  UserPlus,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format, parseISO, isSameDay, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'
import ClientDashboard from '@/pages/client/ClientDashboard'

const CATEGORY_NAMES: Record<string, { label: string; color: string; bg: string }> = {
  tax: { label: 'Impostos & Guias', color: '#3b82f6', bg: 'bg-blue-50 text-blue-700' },
  payroll: { label: 'RH & Holerites', color: '#10b981', bg: 'bg-emerald-50 text-emerald-700' },
  accounting: { label: 'Contábeis', color: '#8b5cf6', bg: 'bg-purple-50 text-purple-700' },
  legal: { label: 'Legal & Contratos', color: '#f59e0b', bg: 'bg-amber-50 text-amber-700' },
}

export default function Index() {
  const { isAccountant, user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [docs, setDocs] = useState<Document[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [requirements, setRequirements] = useState<TaxRegimeRequirement[]>([])
  const [reminders, setReminders] = useState<NotificationReminder[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([])
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [triggeringReminders, setTriggeringReminders] = useState(false)
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all')

  const loadData = async () => {
    try {
      setLoading(true)
      const [d, c, r, rem, ld] = await Promise.all([
        getDocuments(),
        isAccountant ? getCompanies() : Promise.resolve([]),
        isAccountant ? getTaxRegimesRequirements() : Promise.resolve([]),
        isAccountant ? getNotificationReminders(20) : Promise.resolve([]),
        isAccountant ? getLeads() : Promise.resolve([]),
      ])
      setDocs(d)
      if (c) setCompanies(c)
      if (r) setRequirements(r)
      if (rem) setReminders(rem)
      if (ld) setLeads(ld)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [isAccountant])

  useRealtime('documents', () => {
    loadData()
  })
  useRealtime('companies', () => {
    loadData()
  })
  useRealtime('notification_reminders', () => {
    loadData()
  })
  useRealtime('leads', () => {
    loadData()
  })

  // Quick Action Handlers for Accountant
  const handleQuickConfirm = async (doc: Document) => {
    setActionLoadingId(doc.id)
    try {
      await confirmDocument(
        doc.id,
        doc.suggested_category || 'legal',
        false,
        doc.suggested_category || doc.category,
      )
      toast({
        title: 'Categoria confirmada!',
        description: `"${doc.title}" enviada para validação.`,
      })
      setSelectedDocIds((prev) => prev.filter((id) => id !== doc.id))
      await loadData()
    } catch {
      toast({
        title: 'Erro ao confirmar',
        description: 'Não foi possível confirmar a categoria.',
        variant: 'destructive',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  // Bulk Confirmation Handlers
  const handleConfirmSelected = async () => {
    const docsToConfirm = pendingConfirmationDocs.filter((d) => selectedDocIds.includes(d.id))
    if (docsToConfirm.length === 0) return

    setActionLoadingId('selected_bulk')
    try {
      await bulkConfirmDocuments(
        docsToConfirm.map((d) => ({
          id: d.id,
          title: d.title,
          company: d.company,
          suggestedCategory: d.suggested_category || d.category,
          currentCategory: d.category,
        })),
        'Homologação em lote realizada pelo Centro de Comando Golden.',
      )
      toast({
        title: 'Aprovação em lote concluída!',
        description: `${docsToConfirm.length} documento(s) validados. O cliente recebeu a confirmação consolidada por e-mail.`,
      })
      setSelectedDocIds([])
      await loadData()
    } catch {
      toast({
        title: 'Erro na confirmação em lote',
        description: 'Não foi possível confirmar os documentos selecionados.',
        variant: 'destructive',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleConfirmCompanyPendingBatch = async (companyId: string, companyName: string) => {
    const companyDocs = pendingConfirmationDocs.filter((d) => d.company === companyId)
    if (companyDocs.length === 0) return

    setActionLoadingId(`company_bulk_${companyId}`)
    try {
      await bulkConfirmDocuments(
        companyDocs.map((d) => ({
          id: d.id,
          title: d.title,
          company: d.company,
          suggestedCategory: d.suggested_category || d.category,
          currentCategory: d.category,
        })),
        `Homologação em lote concluída para a empresa ${companyName}.`,
      )
      toast({
        title: `Lote confirmado para ${companyName}!`,
        description: `${companyDocs.length} documento(s) validados com sucesso. Notificação consolidada enviada por e-mail ao cliente.`,
      })
      setSelectedDocIds((prev) => prev.filter((id) => !companyDocs.some((cd) => cd.id === id)))
      await loadData()
    } catch {
      toast({
        title: 'Erro ao confirmar lote da empresa',
        description: 'Não foi possível confirmar os documentos.',
        variant: 'destructive',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleQuickApprove = async (doc: Document) => {
    setActionLoadingId(doc.id)
    try {
      await approveDocument(doc.id)
      toast({
        title: 'Documento aprovado!',
        description: `"${doc.title}" foi validado para o cliente.`,
      })
      await loadData()
    } catch {
      toast({
        title: 'Erro ao aprovar',
        description: 'Não foi possível aprovar o documento.',
        variant: 'destructive',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleTriggerReminders = async () => {
    setTriggeringReminders(true)
    try {
      const res: any = await triggerRemindersCheck()
      toast({
        title: 'Verificação de lembretes concluída!',
        description: `${res.sentCount || 0} e-mails de aviso de vencimento disparados.`,
      })
      await loadData()
    } catch (err: any) {
      toast({
        title: 'Erro ao verificar lembretes',
        description: err?.message || 'Falha na comunicação com o backend.',
        variant: 'destructive',
      })
    } finally {
      setTriggeringReminders(false)
    }
  }

  // Filter docs by company if selected
  const filteredDocs = useMemo(() => {
    if (selectedCompanyFilter === 'all') return docs
    return docs.filter((d) => d.company === selectedCompanyFilter)
  }, [docs, selectedCompanyFilter])

  // Filtered metric groups
  const pendingConfirmationDocs = filteredDocs.filter(
    (d) => d.validation_status === 'pending_confirmation',
  )
  const pendingValidationDocs = filteredDocs.filter((d) => d.validation_status === 'pending')
  const approvedDocs = filteredDocs.filter((d) => d.validation_status === 'approved')
  const rejectedDocs = filteredDocs.filter((d) => d.validation_status === 'rejected')
  const unpaidGuides = filteredDocs.filter((d) => d.payment_status === 'pending')

  // Group pending confirmation docs by company for batch-by-client actions
  const pendingCompaniesMap = useMemo(() => {
    const map: Record<string, { companyName: string; docs: Document[] }> = {}
    pendingConfirmationDocs.forEach((d) => {
      const cId = d.company
      const cName = d.expand?.company?.name || 'Empresa Cliente'
      if (!map[cId]) {
        map[cId] = { companyName: cName, docs: [] }
      }
      map[cId].docs.push(d)
    })
    return Object.entries(map).map(([companyId, data]) => ({
      companyId,
      companyName: data.companyName,
      count: data.docs.length,
      docs: data.docs,
    }))
  }, [pendingConfirmationDocs])

  // Selection helpers for Dashboard quick triage
  const allPendingSelected =
    pendingConfirmationDocs.length > 0 &&
    pendingConfirmationDocs.every((d) => selectedDocIds.includes(d.id))
  const somePendingSelected =
    pendingConfirmationDocs.some((d) => selectedDocIds.includes(d.id)) && !allPendingSelected

  const toggleSelectAllPending = () => {
    if (allPendingSelected) {
      const pendingIds = new Set(pendingConfirmationDocs.map((d) => d.id))
      setSelectedDocIds((prev) => prev.filter((id) => !pendingIds.has(id)))
    } else {
      const newIds = new Set([...selectedDocIds, ...pendingConfirmationDocs.map((d) => d.id)])
      setSelectedDocIds(Array.from(newIds))
    }
  }

  const toggleSelectPendingDoc = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  // Calculate upcoming and overdue tax obligations across all companies
  const upcomingObligations = useMemo(() => {
    const list: Array<{
      id: string
      companyName: string
      companyId: string
      companyRegime: string
      title: string
      dueDay: number
      dueDate: Date
      status: 'overdue' | 'warning' | 'ontime'
      daysDiff: number
    }> = []

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    const today = new Date(currentYear, currentMonth, now.getDate(), 0, 0, 0)

    const activeCompanies =
      selectedCompanyFilter === 'all'
        ? companies.filter((c) => c.status !== 'inactive')
        : companies.filter((c) => c.id === selectedCompanyFilter && c.status !== 'inactive')

    activeCompanies.forEach((comp) => {
      const compReqs = requirements.filter((r) => r.regime_type === comp.tax_regime)

      compReqs.forEach((req) => {
        let applies = false
        if (req.frequency === 'monthly') applies = true
        else if (req.frequency === 'quarterly')
          applies = [0, 2, 3, 5, 6, 8, 9, 11].includes(currentMonth)
        else if (req.frequency === 'annually') applies = [2, 4, 5, 6, 11].includes(currentMonth)

        if (applies) {
          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
          const day = Math.min(req.due_day || 20, daysInMonth)
          const dueDate = new Date(currentYear, currentMonth, day, 0, 0, 0)
          const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

          let status: 'overdue' | 'warning' | 'ontime' = 'ontime'
          if (diffDays < 0) status = 'overdue'
          else if (diffDays <= 5) status = 'warning'

          list.push({
            id: `${comp.id}_${req.id}`,
            companyName: comp.name,
            companyId: comp.id,
            companyRegime: comp.tax_regime,
            title: req.requirement_name,
            dueDay: day,
            dueDate,
            status,
            daysDiff: diffDays,
          })
        }
      })
    })

    return list.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  }, [companies, requirements, selectedCompanyFilter])

  const overdueObligations = upcomingObligations.filter((o) => o.status === 'overdue')
  const warningObligations = upcomingObligations.filter((o) => o.status === 'warning')

  // Status breakdown data for chart
  const statusChartData = [
    { name: 'Aprovados', value: approvedDocs.length, fill: '#10b981' },
    { name: 'Em Validação', value: pendingValidationDocs.length, fill: '#f59e0b' },
    { name: 'Triagem IA', value: pendingConfirmationDocs.length, fill: '#6366f1' },
    { name: 'Rejeitados', value: rejectedDocs.length, fill: '#ef4444' },
  ].filter((item) => item.value > 0)

  // Category breakdown data for chart
  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = { tax: 0, payroll: 0, accounting: 0, legal: 0 }
    filteredDocs.forEach((d) => {
      if (counts[d.category] !== undefined) {
        counts[d.category]++
      }
    })
    return [
      { name: 'Impostos', key: 'tax', count: counts.tax, fill: '#3b82f6' },
      { name: 'RH & Folha', key: 'payroll', count: counts.payroll, fill: '#10b981' },
      { name: 'Contábil', key: 'accounting', count: counts.accounting, fill: '#8b5cf6' },
      { name: 'Legal/Contratos', key: 'legal', count: counts.legal, fill: '#f59e0b' },
    ]
  }, [filteredDocs])

  // If user is client, render ClientDashboard directly on "/"
  if (!isAccountant) {
    return <ClientDashboard />
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Banner - Executive Command Center Theme */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Centro de Comando Contábil &bull; Golden Contabilidade</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Visão Geral de Todas as Empresas
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Monitore a esteira de triagem IA, valide documentos enviados, acompanhe vencimentos de
              obrigações fiscais e dispare lembretes automáticos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleTriggerReminders}
              disabled={triggeringReminders}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-950/30 gap-2 font-semibold text-xs h-10 px-4"
            >
              {triggeringReminders ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Disparar Lembretes de Vencimento</span>
            </Button>

            <Link to="/relatorios">
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2 text-xs h-10"
              >
                <BarChart3 className="w-4 h-4 text-emerald-400" /> Relatório Mensal
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Company Filter pill inside header */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300 font-medium">Filtrar Visão por Cliente:</span>
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="all">Todas as Empresas ({companies.length})</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.tax_regime.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span>
              <strong>{companies.length}</strong> Empresas geridas
            </span>
            <span>&bull;</span>
            <span>
              <strong>{docs.length}</strong> Documentos processados
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Command Indicators (4 Main Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Triagem IA */}
        <Card className="border border-indigo-200 bg-gradient-to-b from-indigo-50/70 to-white shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Triagem IA
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-indigo-950">
                {pendingConfirmationDocs.length}
              </span>
              <Link
                to="/admin/documentos/confirmacao"
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-0.5"
              >
                Revisar em Lote <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-xs text-indigo-800 mt-1">Aguardando confirmação de pasta</p>
          </CardContent>
        </Card>

        {/* KPI 2: Validação Pendente */}
        <Card className="border border-amber-200 bg-gradient-to-b from-amber-50/70 to-white shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Validação Técnica
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-amber-950">
                {pendingValidationDocs.length}
              </span>
              <Link
                to="/admin/documentos/pendentes"
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-0.5"
              >
                Aprovar <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-xs text-amber-800 mt-1">Para conferência contábil</p>
          </CardContent>
        </Card>

        {/* KPI 3: Vencimentos Próximos & Vencidos */}
        <Card className="border border-red-200 bg-gradient-to-b from-red-50/70 to-white shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-red-900 uppercase tracking-wider">
                Vencimentos Próximos
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-red-950">
                {overdueObligations.length + warningObligations.length}
              </span>
              <Badge className="bg-red-100 text-red-800 border-red-200 text-[10px]">
                {overdueObligations.length} Vencidas
              </Badge>
            </div>
            <p className="text-xs text-red-800 mt-1">
              {warningObligations.length} obrigações nos próximos 5 dias
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Documentos Aprovados */}
        <Card className="border border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Em Conformidade
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-emerald-950">
                {approvedDocs.length}
              </span>
              <Link
                to="/admin/documentos"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
              >
                Base Total <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-xs text-emerald-800 mt-1">Validados e compliance ativo</p>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Command Row: Direct Pending Queues (Interactive 1-Click Operations) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue 1: Pendências aguardando confirmação de categoria (com Aprovação em Lote) */}
        <Card className="border border-slate-200 shadow-xs bg-white">
          <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Triagem & Confirmação em Lote
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Confirme documentos individuais ou por cliente de uma só vez
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/admin/documentos/confirmacao"
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
              >
                Ver fila ({pendingConfirmationDocs.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-4 space-y-4">
            {/* Quick Bulk Batch Buttons per Company if available */}
            {pendingCompaniesMap.length > 0 && (
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-950 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Aprovar em lote por empresa:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pendingCompaniesMap.map((comp) => {
                    const isProcessing = actionLoadingId === `company_bulk_${comp.companyId}`
                    return (
                      <Button
                        key={comp.companyId}
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleConfirmCompanyPendingBatch(comp.companyId, comp.companyName)
                        }
                        disabled={!!actionLoadingId}
                        className="h-7 text-xs bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-800 border-indigo-200 shadow-2xs font-semibold gap-1.5"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span>
                          {comp.companyName} ({comp.count})
                        </span>
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Selection bar for dashboard queue */}
            {pendingConfirmationDocs.length > 0 && (
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="dash-select-all"
                    checked={
                      allPendingSelected ? true : somePendingSelected ? 'indeterminate' : false
                    }
                    onCheckedChange={toggleSelectAllPending}
                  />
                  <label
                    htmlFor="dash-select-all"
                    className="font-medium text-slate-700 cursor-pointer select-none text-[11px]"
                  >
                    {allPendingSelected ? 'Desmarcar todos' : 'Selecionar pendentes'}
                  </label>
                </div>

                {selectedDocIds.filter((id) => pendingConfirmationDocs.some((d) => d.id === id))
                  .length > 0 && (
                  <Button
                    size="sm"
                    onClick={handleConfirmSelected}
                    disabled={!!actionLoadingId}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-3 shadow-xs gap-1.5"
                  >
                    {actionLoadingId === 'selected_bulk' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <CheckCheck className="w-3.5 h-3.5" />
                    )}
                    <span>
                      Aprovar Selecionados (
                      {
                        selectedDocIds.filter((id) =>
                          pendingConfirmationDocs.some((d) => d.id === id),
                        ).length
                      }
                      )
                    </span>
                  </Button>
                )}
              </div>
            )}

            {pendingConfirmationDocs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                <p className="font-semibold text-slate-700">Toda a triagem está em dia!</p>
                <p>Nenhum documento aguardando classificação.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingConfirmationDocs.slice(0, 5).map((doc) => {
                  const cat = doc.suggested_category || 'tax'
                  const isSelected = selectedDocIds.includes(doc.id)
                  const isProcessing =
                    actionLoadingId === doc.id ||
                    actionLoadingId === 'selected_bulk' ||
                    actionLoadingId === `company_bulk_${doc.company}`

                  return (
                    <div
                      key={doc.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                        isSelected
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectPendingDoc(doc.id)}
                          aria-label={`Selecionar ${doc.title}`}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{doc.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-slate-500">
                              {doc.expand?.company?.name || 'Empresa'}
                            </span>
                            <Badge className="bg-indigo-100 text-indigo-800 text-[9px] px-1.5 py-0 border-indigo-200">
                              IA: {CATEGORY_NAMES[cat]?.label || cat}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleQuickConfirm(doc)}
                        disabled={isProcessing}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3 flex-shrink-0 shadow-xs"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        ) : (
                          <Check className="w-3.5 h-3.5 mr-1" />
                        )}
                        Confirmar
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Queue 2: Validação Técnica Pendente */}
        <Card className="border border-slate-200 shadow-xs bg-white">
          <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Fila de Validação Contábil
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Documentos categorizados prontos para aprovação
                </CardDescription>
              </div>
            </div>

            <Link
              to="/admin/documentos/pendentes"
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              Ver esteira ({pendingValidationDocs.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="p-5 pt-4">
            {pendingValidationDocs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                <p className="font-semibold text-slate-700">Nenhum documento pendente!</p>
                <p>Todos os arquivos foram aprovados ou processados.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingValidationDocs.slice(0, 4).map((doc) => {
                  const isProcessing = actionLoadingId === doc.id
                  return (
                    <div
                      key={doc.id}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{doc.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-slate-500">
                            {doc.expand?.company?.name || 'Empresa'}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              CATEGORY_NAMES[doc.category]?.bg || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {CATEGORY_NAMES[doc.category]?.label || doc.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleQuickApprove(doc)}
                          disabled={isProcessing}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-2.5 shadow-xs"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                          ) : (
                            <Check className="w-3.5 h-3.5 mr-1" />
                          )}
                          Aprovar
                        </Button>
                        <Link to="/admin/documentos/pendentes">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-8 px-2 text-slate-600"
                          >
                            Detalhes
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Deadlines Section & Document Volumes Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tax Obligations Deadlines & Sent Reminders Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vencimentos Próximos de Obrigações */}
          <Card className="border border-slate-200 shadow-xs bg-white">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Próximos Vencimentos de Obrigações Fiscais
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Prazos por regime tributário de cada empresa cliente
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleTriggerReminders}
                  disabled={triggeringReminders}
                  className="text-xs h-8 text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Enviar Lembretes</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-3">
              {upcomingObligations.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Nenhuma obrigação prevista para os regimes cadastrados.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {upcomingObligations.slice(0, 5).map((ob) => (
                    <div
                      key={ob.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {ob.status === 'overdue' && (
                            <div className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                              !
                            </div>
                          )}
                          {ob.status === 'warning' && (
                            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                              ⏳
                            </div>
                          )}
                          {ob.status === 'ontime' && (
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                              ✓
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-900">{ob.title}</p>
                          <p className="text-[11px] text-slate-500">
                            <strong>{ob.companyName}</strong> &bull; Regime:{' '}
                            <span className="uppercase">{ob.companyRegime}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-800">
                            {format(ob.dueDate, 'dd/MM/yyyy')}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {ob.daysDiff < 0
                              ? `Venceu há ${Math.abs(ob.daysDiff)} dias`
                              : ob.daysDiff === 0
                                ? 'Vence HOJE'
                                : `Vence em ${ob.daysDiff} dias`}
                          </p>
                        </div>

                        {ob.status === 'overdue' && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 text-[10px]">
                            Vencida
                          </Badge>
                        )}
                        {ob.status === 'warning' && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">
                            Próxima
                          </Badge>
                        )}
                        {ob.status === 'ontime' && (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                            Em dia
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Histórico de Lembretes Automáticos Disparados */}
          <Card className="border border-slate-200 shadow-xs bg-white">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  Registro de Lembretes por E-mail (Anti-Duplicidade)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Envios automáticos registrados para cada cliente e obrigação
                </CardDescription>
              </div>

              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs">
                {reminders.length} disparos
              </Badge>
            </CardHeader>

            <CardContent className="p-5 pt-3">
              {reminders.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Nenhum lembrete disparado ainda. Use o botão acima para executar a verificação.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {reminders.map((rem) => (
                    <div
                      key={rem.id}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 truncate">
                            {rem.requirement_name}
                          </span>
                          <span className="text-slate-400">&bull;</span>
                          <span className="text-slate-600 truncate">
                            {rem.expand?.company?.name || 'Cliente'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                          Enviado para: {rem.recipient_email} &bull; Vencimento: {rem.due_date}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                          Enviado
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Volume Charts & Quick Navigation Cards */}
        <div className="space-y-6">
          {/* Chart: Status Breakdown */}
          <Card className="border border-slate-200 shadow-xs bg-white">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold text-slate-900">
                Volume por Status de Validação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 h-[220px]">
              {statusChartData.length > 0 ? (
                <ChartContainer
                  config={{
                    approved: { color: '#10b981' },
                    pending: { color: '#f59e0b' },
                    confirmation: { color: '#6366f1' },
                    rejected: { color: '#ef4444' },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Sem dados para exibição
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chart: Volume por Categoria */}
          <Card className="border border-slate-200 shadow-xs bg-white">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold text-slate-900">
                Volume por Categoria Fiscal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2.5">
              {categoryCount.map((cat) => {
                const total = filteredDocs.length || 1
                const percent = Math.round((cat.count / total) * 100)
                return (
                  <div key={cat.key} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-700">{cat.name}</span>
                      <span className="text-slate-900 font-bold">
                        {cat.count} doc(s) ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${percent}%`, backgroundColor: cat.fill }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Quick Shortcuts Box */}
          <Card className="border border-slate-200 shadow-xs bg-gradient-to-br from-slate-900 to-slate-950 text-white">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Atalhos Rápidos de Gestão
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2">
              <Link
                to="/admin/leads"
                className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-xs text-slate-200 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                  <span>Funil de Leads & Contatos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {leads.filter((l) => l.status === 'new').length > 0 && (
                    <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0">
                      {leads.filter((l) => l.status === 'new').length} Novos
                    </Badge>
                  )}
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </Link>

              <Link
                to="/admin/documentos/confirmacao"
                className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-xs text-slate-200 hover:text-white transition-colors"
              >
                <span>Fila de Triagem IA (Aprovação em Lote)</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
              </Link>

              <Link
                to="/admin/documentos/pendentes"
                className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-xs text-slate-200 hover:text-white transition-colors"
              >
                <span>Fila de Validação Técnica</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>

              <Link
                to="/companies"
                className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-xs text-slate-200 hover:text-white transition-colors"
              >
                <span>Carteira de Empresas & Clientes</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              </Link>

              <Link
                to="/relatorios"
                className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between text-xs text-slate-200 hover:text-white transition-colors"
              >
                <span>Gerar Relatório Mensal Consolidado</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
