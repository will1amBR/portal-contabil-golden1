import { useState, useEffect, useMemo, useRef } from 'react'
import { getDocuments, getCompanies, type Document, type Company } from '@/services/api'
import { useAuth } from '@/hooks/use-auth'
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  FileText,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Building2,
  Receipt,
  Wallet,
  Calculator,
  Scale,
  Download,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const CATEGORIES = [
  { key: 'tax', label: 'Impostos', icon: Receipt, color: '#3b82f6' },
  { key: 'payroll', label: 'Holerites (RH)', icon: Wallet, color: '#10b981' },
  { key: 'accounting', label: 'Contábeis', icon: Calculator, color: '#8b5cf6' },
  { key: 'legal', label: 'Legais', icon: Scale, color: '#f59e0b' },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> =
  {
    approved: {
      label: 'Aprovados',
      color: '#10b981',
      bg: 'bg-emerald-50 text-emerald-700',
      border: 'border-emerald-200',
    },
    rejected: {
      label: 'Rejeitados',
      color: '#ef4444',
      bg: 'bg-red-50 text-red-700',
      border: 'border-red-200',
    },
    pending: {
      label: 'Em Validação',
      color: '#f59e0b',
      bg: 'bg-amber-50 text-amber-700',
      border: 'border-amber-200',
    },
    pending_confirmation: {
      label: 'Aguardando Confirmação',
      color: '#6366f1',
      bg: 'bg-indigo-50 text-indigo-700',
      border: 'border-indigo-200',
    },
  }

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export default function MonthlyReport() {
  const { user, isAccountant } = useAuth()
  const [docs, setDocs] = useState<Document[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1 // 1-12

  const [selectedMonth, setSelectedMonth] = useState<string>(String(currentMonth))
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear))
  const [selectedCompany, setSelectedCompany] = useState<string>('all')

  const reportRef = useRef<HTMLDivElement>(null)

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

  // Filtered documents by Month, Year and Company
  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      if (!doc.created) return false
      const date = parseISO(doc.created)
      const matchesMonth = selectedMonth === 'all' || date.getMonth() + 1 === Number(selectedMonth)
      const matchesYear = selectedYear === 'all' || date.getFullYear() === Number(selectedYear)
      const matchesCompany = selectedCompany === 'all' || doc.company === selectedCompany

      return matchesMonth && matchesYear && matchesCompany
    })
  }, [docs, selectedMonth, selectedYear, selectedCompany])

  // Category counts
  const categoryStats = useMemo(() => {
    const counts = { tax: 0, payroll: 0, accounting: 0, legal: 0 }
    filteredDocs.forEach((doc) => {
      const cat = doc.category as keyof typeof counts
      if (counts[cat] !== undefined) {
        counts[cat]++
      } else {
        counts.legal++
      }
    })
    return counts
  }, [filteredDocs])

  // Status counts
  const statusStats = useMemo(() => {
    const counts = {
      approved: 0,
      rejected: 0,
      pending: 0,
      pending_confirmation: 0,
    }
    filteredDocs.forEach((doc) => {
      const status = doc.validation_status || 'pending'
      if (counts[status as keyof typeof counts] !== undefined) {
        counts[status as keyof typeof counts]++
      } else {
        counts.pending++
      }
    })
    return counts
  }, [filteredDocs])

  // Chart Data: Categories
  const categoryChartData = useMemo(() => {
    return [
      { name: 'Impostos', quantidade: categoryStats.tax, fill: '#3b82f6' },
      { name: 'RH & Holerites', quantidade: categoryStats.payroll, fill: '#10b981' },
      { name: 'Contábeis', quantidade: categoryStats.accounting, fill: '#8b5cf6' },
      { name: 'Legais', quantidade: categoryStats.legal, fill: '#f59e0b' },
    ]
  }, [categoryStats])

  // Chart Data: Status Pie
  const statusChartData = useMemo(() => {
    return [
      { name: 'Aprovados', value: statusStats.approved, color: '#10b981' },
      { name: 'Rejeitados', value: statusStats.rejected, color: '#ef4444' },
      { name: 'Em Validação', value: statusStats.pending, color: '#f59e0b' },
      { name: 'Aguardando Confirmação', value: statusStats.pending_confirmation, color: '#6366f1' },
    ].filter((item) => item.value > 0)
  }, [statusStats])

  // Print handler (native printable report & PDF save)
  const handlePrint = () => {
    window.print()
  }

  const selectedMonthLabel =
    selectedMonth === 'all' ? 'Todos os Meses' : MONTH_NAMES[Number(selectedMonth) - 1]

  const selectedCompanyName =
    selectedCompany === 'all'
      ? 'Todas as Empresas'
      : companies.find((c) => c.id === selectedCompany)?.name || 'Empresa'

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 print:p-0 print:m-0 print:max-w-full">
      {/* Non-printable header and filter bar */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Relatório Mensal de Documentos
            </h1>
            <p className="text-slate-500 mt-1">
              Análise detalhada de fluxo de documentos, categorias e status de validação.
            </p>
          </div>

          <Button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" /> Exportar / Imprimir PDF
          </Button>
        </div>

        {/* Filter Card */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-700">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>Filtros do Relatório</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Month Selector */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Mês de Referência
                </label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Ano Inteiro (Todos os Meses)</SelectItem>
                    {MONTH_NAMES.map((name, idx) => (
                      <SelectItem key={idx + 1} value={String(idx + 1)}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Selector */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Ano</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2027">2027</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="all">Todos os Anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Company Selector */}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Empresa</label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                    <SelectValue />
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Printable Report Content Container */}
      <div ref={reportRef} className="space-y-6 bg-white print:p-4 rounded-xl">
        {/* Printable Official Header (only appears on print or top of report) */}
        <div className="border-b pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                PC
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Portal Contábil Integrado</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Demonstrativo de Controle e Validação de Documentos
            </p>
          </div>
          <div className="text-right text-xs text-slate-500 space-y-0.5">
            <p>
              <span className="font-semibold text-slate-700">Período:</span> {selectedMonthLabel} /{' '}
              {selectedYear === 'all' ? 'Todos' : selectedYear}
            </p>
            <p>
              <span className="font-semibold text-slate-700">Empresa:</span> {selectedCompanyName}
            </p>
            <p>
              <span className="font-semibold text-slate-700">Gerado por:</span>{' '}
              {user?.name || 'Usuário'} ({isAccountant ? 'Contador' : 'Cliente'})
            </p>
            <p>
              <span className="font-semibold text-slate-700">Data de emissão:</span>{' '}
              {format(new Date(), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            Resumo Geral do Período
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card className="border bg-slate-50/50 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">Total Enviado</p>
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900 mt-2">{filteredDocs.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">documentos no período</p>
              </CardContent>
            </Card>

            <Card className="border bg-emerald-50/40 border-emerald-100 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-emerald-700">Aprovados</p>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-emerald-700 mt-2">{statusStats.approved}</p>
                <p className="text-[11px] text-emerald-600/80 mt-0.5">
                  {filteredDocs.length > 0
                    ? `${Math.round((statusStats.approved / filteredDocs.length) * 100)}% do total`
                    : '0%'}
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-amber-50/40 border-amber-100 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-amber-700">Em Validação</p>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-amber-700 mt-2">{statusStats.pending}</p>
                <p className="text-[11px] text-amber-600/80 mt-0.5">
                  {filteredDocs.length > 0
                    ? `${Math.round((statusStats.pending / filteredDocs.length) * 100)}% do total`
                    : '0%'}
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-indigo-50/40 border-indigo-100 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-indigo-700">Confirmação</p>
                  <AlertCircle className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-indigo-700 mt-2">
                  {statusStats.pending_confirmation}
                </p>
                <p className="text-[11px] text-indigo-600/80 mt-0.5">aguardando IA/contador</p>
              </CardContent>
            </Card>

            <Card className="border bg-red-50/40 border-red-100 shadow-none col-span-2 md:col-span-1">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-red-700">Rejeitados</p>
                  <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-700 mt-2">{statusStats.rejected}</p>
                <p className="text-[11px] text-red-600/80 mt-0.5">necessitam reenvio</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category breakdown boxes */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
            Detalhamento por Categoria
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => {
              const count = categoryStats[cat.key as keyof typeof categoryStats]
              const percent =
                filteredDocs.length > 0 ? Math.round((count / filteredDocs.length) * 100) : 0
              const Icon = cat.icon
              return (
                <div
                  key={cat.key}
                  className="p-3.5 rounded-lg border bg-slate-50/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{cat.label}</p>
                      <p className="text-[11px] text-slate-500">{percent}% do volume</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-slate-900">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2">
          {/* Bar Chart: Categories */}
          <Card className="border shadow-none">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold text-slate-900">
                Distribuição por Categoria
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Quantidade de documentos por tipo contábil/fiscal
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryChartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <RechartsTooltip
                      formatter={(val: any) => [`${val} documentos`, 'Volume']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                      }}
                    />
                    <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart: Status Breakdown */}
          <Card className="border shadow-none">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold text-slate-900">
                Proporção por Status de Validação
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Taxa de aprovação, pendências e rejeições
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {statusChartData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
                  Nenhum dado para o período selecionado
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }: any) =>
                          `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(val: any) => [`${val} documentos`, 'Total']} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                          <span className="text-xs text-slate-600">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Document Table */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Relação Analítica de Documentos ({filteredDocs.length})
            </h3>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border rounded-lg text-sm bg-slate-50/50">
              Nenhum documento encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b text-slate-600 font-semibold">
                    <th className="p-3">Título do Documento</th>
                    <th className="p-3">Empresa</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3">Data de Envio</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Observações de Validação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => {
                    const status = doc.validation_status || 'pending'
                    const conf = STATUS_CONFIG[status] || STATUS_CONFIG.pending
                    const catFriendly =
                      CATEGORIES.find((c) => c.key === doc.category)?.label || doc.category

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-medium text-slate-900">{doc.title}</td>
                        <td className="p-3 text-slate-600">
                          {doc.expand?.company?.name || 'Tech Solutions LTDA'}
                        </td>
                        <td className="p-3 text-slate-700 font-medium">{catFriendly}</td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">
                          {format(parseISO(doc.created), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${conf.bg} border ${conf.border}`}
                          >
                            {conf.label}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 max-w-xs truncate">
                          {doc.validation_notes ||
                            (doc.validated_by ? 'Validado sem ressalvas' : '-')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Printable Footer */}
        <div className="pt-6 mt-6 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} Portal Contábil Integrado. Todos os direitos reservados.
          </p>
          <p>Relatório gerado eletronicamente para fins de acompanhamento contábil e fiscal.</p>
        </div>
      </div>
    </div>
  )
}
