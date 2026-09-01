import { useState, useEffect, useMemo } from 'react'
import { getDocuments, getCompanies, type Document, type Company } from '@/services/api'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import {
  Sparkles,
  CheckCircle2,
  Edit3,
  BarChart3,
  TrendingUp,
  Building2,
  Calendar,
  Layers,
  FileCheck2,
  Filter,
  Receipt,
  Wallet,
  Calculator,
  Scale,
  BrainCircuit,
  Zap,
} from 'lucide-react'
import { format, parseISO, isSameMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const CATEGORY_NAMES: Record<string, { label: string; icon: any; color: string }> = {
  tax: { label: 'Impostos & Guias', icon: Receipt, color: 'text-blue-600' },
  payroll: { label: 'RH & Folha', icon: Wallet, color: 'text-emerald-600' },
  accounting: { label: 'Contábeis', icon: Calculator, color: 'text-purple-600' },
  legal: { label: 'Legal & Contratos', icon: Scale, color: 'text-amber-600' },
}

export default function AdminAiPerformance() {
  const [docs, setDocs] = useState<Document[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const [d, c] = await Promise.all([getDocuments(), getCompanies()])
      setDocs(d)
      setCompanies(c)
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

  // Filter documents by company and period
  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      // Company filter
      if (selectedCompanyId !== 'all' && doc.company !== selectedCompanyId) {
        return false
      }

      // Period filter (e.g. current year, last 3 months, or specific month)
      if (selectedPeriod !== 'all') {
        const docDate = new Date(doc.created)
        const now = new Date()

        if (selectedPeriod === 'current_month') {
          if (!isSameMonth(docDate, now)) return false
        } else if (selectedPeriod === 'last_3_months') {
          const diffMonths =
            (now.getFullYear() - docDate.getFullYear()) * 12 + (now.getMonth() - docDate.getMonth())
          if (diffMonths > 3) return false
        } else if (selectedPeriod === '2026') {
          if (docDate.getFullYear() !== 2026) return false
        }
      }

      return true
    })
  }, [docs, selectedCompanyId, selectedPeriod])

  // Compute AI Accuracy & Classification metrics
  const metrics = useMemo(() => {
    // A document was analyzed if it passed through triagem (suggested_category exists or is confirmed/approved/rejected/pending)
    const analyzedDocs = filteredDocs.filter((d) => {
      return (
        d.validation_status !== 'pending_confirmation' ||
        d.suggested_category ||
        d.original_suggested_category
      )
    })

    const totalAnalyzed = analyzedDocs.length

    // Hits: The final confirmed category is the same as the AI suggested category, or ai_adjusted is false/undefined when category == suggested_category
    let hits = 0
    let manualAdjustments = 0
    let pendingConfirmation = 0

    const categoryBreakdown: Record<
      string,
      { total: number; hits: number; adjusted: number; accuracy: number }
    > = {
      tax: { total: 0, hits: 0, adjusted: 0, accuracy: 0 },
      payroll: { total: 0, hits: 0, adjusted: 0, accuracy: 0 },
      accounting: { total: 0, hits: 0, adjusted: 0, accuracy: 0 },
      legal: { total: 0, hits: 0, adjusted: 0, accuracy: 0 },
    }

    analyzedDocs.forEach((doc) => {
      if (doc.validation_status === 'pending_confirmation') {
        pendingConfirmation++
        return
      }

      const originalSuggestion =
        doc.original_suggested_category || doc.suggested_category || doc.category
      const finalCategory = doc.category || 'legal'

      // Check if was adjusted: either explicitly flagged as ai_adjusted or final != original suggestion
      const wasAdjusted =
        doc.ai_adjusted === true || (originalSuggestion && originalSuggestion !== finalCategory)

      if (wasAdjusted) {
        manualAdjustments++
      } else {
        hits++
      }

      const catKey = originalSuggestion || finalCategory
      if (categoryBreakdown[catKey]) {
        categoryBreakdown[catKey].total++
        if (wasAdjusted) {
          categoryBreakdown[catKey].adjusted++
        } else {
          categoryBreakdown[catKey].hits++
        }
      }
    })

    const decidedTotal = hits + manualAdjustments
    const accuracyRate = decidedTotal > 0 ? Math.round((hits / decidedTotal) * 100) : 100

    // Compute accuracy per category
    Object.keys(categoryBreakdown).forEach((k) => {
      const item = categoryBreakdown[k]
      item.accuracy = item.total > 0 ? Math.round((item.hits / item.total) * 100) : 100
    })

    // Breakdown per client company
    const companyStats = companies.map((comp) => {
      const compDocs = analyzedDocs.filter((d) => d.company === comp.id)
      let compHits = 0
      let compAdjusted = 0

      compDocs.forEach((d) => {
        if (d.validation_status === 'pending_confirmation') return
        const orig = d.original_suggested_category || d.suggested_category || d.category
        if (d.ai_adjusted === true || (orig && orig !== d.category)) {
          compAdjusted++
        } else {
          compHits++
        }
      })

      const compTotal = compHits + compAdjusted
      const compRate = compTotal > 0 ? Math.round((compHits / compTotal) * 100) : 100

      return {
        company: comp,
        total: compDocs.length,
        decided: compTotal,
        hits: compHits,
        adjusted: compAdjusted,
        rate: compRate,
      }
    })

    return {
      totalAnalyzed,
      hits,
      manualAdjustments,
      pendingConfirmation,
      decidedTotal,
      accuracyRate,
      categoryBreakdown,
      companyStats,
    }
  }, [filteredDocs, companies])

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Centro de Inteligência Artificial &bull; Golden Contabilidade</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Desempenho da IA Contábil
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Monitore a precisão das sugestões da IA comparando os acertos confirmados diretamente
              com os ajustes manuais realizados pelos contadores.
            </p>
          </div>

          {/* Overall Accuracy Gauge Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-center min-w-[200px] shadow-lg">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Taxa Geral de Acerto
            </span>
            <div className="text-4xl font-extrabold text-emerald-400 mt-1 font-mono">
              {metrics.accuracyRate}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {metrics.hits} acertos em {metrics.decidedTotal} avaliações
            </p>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <Card className="border border-slate-200 shadow-xs bg-white">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filtros de Análise:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Company Filter */}
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <span className="text-xs text-slate-500 whitespace-nowrap">Empresa:</span>
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                <SelectTrigger className="h-9 w-full sm:w-56 text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Todas as empresas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Empresas ({companies.length})</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Period Filter */}
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <span className="text-xs text-slate-500 whitespace-nowrap">Período:</span>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="h-9 w-full sm:w-44 text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Todo o histórico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo o Histórico</SelectItem>
                  <SelectItem value="current_month">Mês Atual</SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                  <SelectItem value="2026">Exercício 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-xs bg-white">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Documentos Analisados
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{metrics.totalAnalyzed}</p>
            <p className="text-xs text-slate-500">Total submetido à triagem IA</p>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200 shadow-xs bg-emerald-50/20">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase">Acertos da IA</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-700">{metrics.hits}</p>
            <p className="text-xs text-emerald-600 font-medium">Confirmados sem alteração</p>
          </CardContent>
        </Card>

        <Card className="border border-amber-200 shadow-xs bg-amber-50/20">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase">Ajustes Manuais</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Edit3 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-amber-700">{metrics.manualAdjustments}</p>
            <p className="text-xs text-amber-600 font-medium">Reclassificados pelo contador</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-xs bg-white">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Em Triagem</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-indigo-700">{metrics.pendingConfirmation}</p>
            <p className="text-xs text-slate-500">Aguardando decisão</p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown by Category & Accuracy Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 border border-slate-200 shadow-xs bg-white">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-600" />
                  Taxa de Acerto por Categoria
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Desempenho da IA nas 4 principais áreas fiscais e contábeis
                </CardDescription>
              </div>
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs font-medium">
                Detalhamento IA
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-2 space-y-4">
            {Object.entries(metrics.categoryBreakdown).map(([key, data]) => {
              const catConfig = CATEGORY_NAMES[key] || CATEGORY_NAMES.tax
              const Icon = catConfig.icon

              return (
                <div
                  key={key}
                  className="space-y-1.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      <Icon className={`w-4 h-4 ${catConfig.color}`} />
                      <span>{catConfig.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px]">
                        {data.hits} acertos / {data.total} docs
                      </span>
                      <Badge
                        className={`text-[11px] font-bold ${
                          data.accuracy >= 80
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : data.accuracy >= 60
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                        }`}
                      >
                        {data.accuracy}%
                      </Badge>
                    </div>
                  </div>

                  <Progress
                    value={data.accuracy}
                    className="h-2 bg-slate-200 [&>div]:bg-emerald-600"
                  />
                </div>
              )
            })}

            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Aprendizado Contínuo:</strong> Cada ajuste manual realizado pelo contador
                alimenta os pesos semânticos e o histórico para refinar a categorização dos próximos
                documentos enviados pelos clientes.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown by Company Table */}
        <Card className="lg:col-span-5 border border-slate-200 shadow-xs bg-white">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Precisão por Empresa Cliente
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Taxa de assertividade da esteira em cada cliente
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 pt-0">
            <div className="divide-y divide-slate-100">
              {metrics.companyStats.map((item) => (
                <div key={item.company.id} className="py-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.company.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {item.company.cnpj} &bull; {item.total} docs analisados
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <Badge
                      className={`text-xs font-mono font-bold ${
                        item.rate >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.rate}% precisão
                    </Badge>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {item.hits} acertos &bull; {item.adjusted} ajustes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Logs of AI Decisions & Confirmations */}
      <Card className="border border-slate-200 shadow-xs bg-white">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Histórico de Triagem & Auditoria da IA ({filteredDocs.length})
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Registro detalhado de cada documento, sugestão original da IA e confirmação do
                contador
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b border-slate-200">
                  <TableHead className="py-3 text-xs font-bold text-slate-700 uppercase">
                    Documento
                  </TableHead>
                  <TableHead className="py-3 text-xs font-bold text-slate-700 uppercase">
                    Empresa
                  </TableHead>
                  <TableHead className="py-3 text-xs font-bold text-slate-700 uppercase">
                    Sugestão IA
                  </TableHead>
                  <TableHead className="py-3 text-xs font-bold text-slate-700 uppercase">
                    Categoria Final
                  </TableHead>
                  <TableHead className="py-3 text-xs font-bold text-slate-700 uppercase text-right">
                    Resultado da IA
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {filteredDocs.slice(0, 15).map((doc) => {
                  const suggestedKey =
                    doc.original_suggested_category || doc.suggested_category || doc.category
                  const finalKey = doc.category || 'legal'
                  const wasAdjusted =
                    doc.ai_adjusted === true || (suggestedKey && suggestedKey !== finalKey)
                  const isPending = doc.validation_status === 'pending_confirmation'

                  const sugCfg = CATEGORY_NAMES[suggestedKey] || CATEGORY_NAMES.tax
                  const finalCfg = CATEGORY_NAMES[finalKey] || CATEGORY_NAMES.tax

                  return (
                    <TableRow key={doc.id} className="hover:bg-slate-50/70">
                      <TableCell className="py-3">
                        <span className="font-semibold text-slate-900 text-xs block">
                          {doc.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {format(parseISO(doc.created), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </TableCell>

                      <TableCell className="py-3 text-xs text-slate-600">
                        {doc.expand?.company?.name || 'Koren Ambiental'}
                      </TableCell>

                      <TableCell className="py-3">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700">
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          {sugCfg.label}
                        </span>
                      </TableCell>

                      <TableCell className="py-3">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-900">
                          {finalCfg.label}
                        </span>
                      </TableCell>

                      <TableCell className="py-3 text-right">
                        {isPending ? (
                          <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px]">
                            Aguardando Confirmação
                          </Badge>
                        ) : wasAdjusted ? (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] gap-1">
                            <Edit3 className="w-3 h-3" /> Ajuste Manual
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] gap-1">
                            <CheckCircle2 className="w-3 h-3" /> IA Acertou
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
