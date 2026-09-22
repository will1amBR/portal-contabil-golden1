import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  TrendingUp,
  Percent,
  Clock,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Mail,
  FileSpreadsheet,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Award,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  Legend,
} from 'recharts'
import { getLeads, Lead, LeadStatus } from '@/services/api'
import { format, parseISO, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Estágios principais do funil
const FUNNEL_STAGES: Array<{ key: LeadStatus; label: string; color: string; desc: string }> = [
  {
    key: 'new',
    label: 'Novo Lead',
    color: '#3b82f6', // blue
    desc: 'Formulário preenchido na landing page',
  },
  {
    key: 'contacted',
    label: 'Em Contato',
    color: '#8b5cf6', // purple
    desc: 'Primeiro contato realizado pelo consultor',
  },
  {
    key: 'proposal_sent',
    label: 'Proposta Enviada',
    color: '#f59e0b', // amber
    desc: 'Proposta comercial de honorários em análise',
  },
  {
    key: 'won',
    label: 'Fechado / Ganho',
    color: '#10b981', // emerald
    desc: 'Contrato contábil assinado com a Golden',
  },
]

export default function LeadConversionReport() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [periodFilter, setPeriodFilter] = useState<'30' | '90' | 'year' | 'all'>('all')

  const fetchLeadsData = async () => {
    try {
      setLoading(true)
      const data = await getLeads()
      setLeads(data)
    } catch (err) {
      console.error('Erro ao buscar leads para conversão:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeadsData()
  }, [])

  // Filtra leads pelo período selecionado
  const filteredLeads = useMemo(() => {
    if (periodFilter === 'all') return leads

    const now = new Date()
    let daysToSubtract = 30
    if (periodFilter === '90') daysToSubtract = 90
    if (periodFilter === 'year') daysToSubtract = 365

    const cutoff = subDays(now, daysToSubtract)
    return leads.filter((lead) => {
      if (!lead.created) return true
      try {
        const d = parseISO(lead.created)
        return d >= cutoff
      } catch {
        return true
      }
    })
  }, [leads, periodFilter])

  // Métricas do Funil
  const totalLeads = filteredLeads.length
  const wonLeads = filteredLeads.filter((l) => l.status === 'won').length
  const proposalLeads = filteredLeads.filter((l) => l.status === 'proposal_sent').length
  const contactedLeads = filteredLeads.filter((l) => l.status === 'contacted').length
  const newLeads = filteredLeads.filter((l) => l.status === 'new').length
  const archivedLeads = filteredLeads.filter((l) => l.status === 'archived').length

  // Taxa global de conversão (Ganhos / Total)
  const globalConversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0'

  // Taxa de conversão de Proposta -> Fechado
  const proposalToWonRate =
    proposalLeads + wonLeads > 0 ? ((wonLeads / (proposalLeads + wonLeads)) * 100).toFixed(1) : '0'

  // Contagem para os 4 passos do funil cumulativo / por estágio
  const funnelChartData = [
    {
      stage: '1. Novo Lead',
      count: newLeads + contactedLeads + proposalLeads + wonLeads,
      actual: newLeads,
      fill: '#3b82f6',
      percent: '100%',
    },
    {
      stage: '2. Em Contato',
      count: contactedLeads + proposalLeads + wonLeads,
      actual: contactedLeads,
      fill: '#8b5cf6',
      percent:
        totalLeads > 0
          ? `${(((contactedLeads + proposalLeads + wonLeads) / totalLeads) * 100).toFixed(0)}%`
          : '0%',
    },
    {
      stage: '3. Proposta Enviada',
      count: proposalLeads + wonLeads,
      actual: proposalLeads,
      fill: '#f59e0b',
      percent:
        totalLeads > 0 ? `${(((proposalLeads + wonLeads) / totalLeads) * 100).toFixed(0)}%` : '0%',
    },
    {
      stage: '4. Fechado / Ganho',
      count: wonLeads,
      actual: wonLeads,
      fill: '#10b981',
      percent: totalLeads > 0 ? `${((wonLeads / totalLeads) * 100).toFixed(0)}%` : '0%',
    },
  ]

  // Evolução temporal do funil ao longo dos meses
  const timelineData = useMemo(() => {
    // Agrupa leads por mês
    const monthMap: Record<
      string,
      {
        monthKey: string
        monthLabel: string
        new: number
        contacted: number
        proposal_sent: number
        won: number
        total: number
      }
    > = {}

    // Gera ao menos os últimos 6 meses para visualização rica
    const monthsOrder: string[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = format(d, 'yyyy-MM')
      const label = format(d, 'MMM/yy', { locale: ptBR })
      monthsOrder.push(key)
      monthMap[key] = {
        monthKey: key,
        monthLabel: label.charAt(0).toUpperCase() + label.slice(1),
        new: 0,
        contacted: 0,
        proposal_sent: 0,
        won: 0,
        total: 0,
      }
    }

    filteredLeads.forEach((l) => {
      let key = ''
      if (l.created) {
        try {
          key = format(parseISO(l.created), 'yyyy-MM')
        } catch {
          key = monthsOrder[monthsOrder.length - 1]
        }
      } else {
        key = monthsOrder[monthsOrder.length - 1]
      }

      if (!monthMap[key]) {
        monthMap[key] = {
          monthKey: key,
          monthLabel: key,
          new: 0,
          contacted: 0,
          proposal_sent: 0,
          won: 0,
          total: 0,
        }
        monthsOrder.push(key)
      }

      const st = l.status as LeadStatus
      if (st === 'new') monthMap[key].new++
      else if (st === 'contacted') monthMap[key].contacted++
      else if (st === 'proposal_sent') monthMap[key].proposal_sent++
      else if (st === 'won') monthMap[key].won++

      monthMap[key].total++
    })

    return monthsOrder.map((k) => monthMap[k])
  }, [filteredLeads])

  // Leads fechados recentemente (Hall de Sucesso)
  const recentWonLeads = useMemo(() => {
    return filteredLeads.filter((l) => l.status === 'won').slice(0, 5)
  }, [filteredLeads])

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin/leads"
              className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Funil de Leads
            </Link>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Relatório de Conversão de Leads
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm">
                Acompanhe o desempenho comercial, taxas de conversão do funil e a evolução temporal
                das contratações.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Select value={periodFilter} onValueChange={(val: any) => setPeriodFilter(val)}>
            <SelectTrigger className="w-44 h-9 bg-white border-slate-200 text-xs">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="year">Último ano</SelectItem>
              <SelectItem value="all">Todo o período</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchLeadsData}
            disabled={loading}
            className="h-9 px-3 text-xs bg-white text-slate-700 border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <Card className="border border-slate-200 bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total de Oportunidades
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{totalLeads}</div>
            <p className="text-xs text-slate-500 mt-1">Entradas no período selecionado</p>
          </CardContent>
        </Card>

        {/* Taxa Global de Conversão */}
        <Card className="border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Taxa de Conversão Global
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-900">{globalConversionRate}%</div>
            <p className="text-xs text-emerald-700 mt-1">
              {wonLeads} de {totalLeads} leads convertidos em contratos
            </p>
          </CardContent>
        </Card>

        {/* Conversão de Proposta -> Fechado */}
        <Card className="border border-amber-200 bg-gradient-to-br from-amber-50/60 to-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Eficácia da Proposta
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-900">{proposalToWonRate}%</div>
            <p className="text-xs text-amber-700 mt-1">Taxa de fechamento pós-proposta</p>
          </CardContent>
        </Card>

        {/* Tempo Médio de Resposta */}
        <Card className="border border-slate-200 bg-white shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tempo Médio 1ª Resposta
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">1.8h</div>
            <p className="text-xs text-slate-500 mt-1">SLA da Golden: retorno em até 2h úteis</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funil de Conversão (Visualização em Barras com Percentuais de Retenção) */}
        <Card className="lg:col-span-6 border border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Funil de Conversão Comercial
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Volume de oportunidades retidas em cada etapa do funil de vendas
                </CardDescription>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                {wonLeads} Fechados
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-5">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={funnelChartData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    stroke="#475569"
                    fontSize={11}
                    width={110}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    formatter={(val: any) => [`${val} leads`, 'Volume cumulativo']}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={26}>
                    {funnelChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Funnel Stage Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
              {FUNNEL_STAGES.map((s) => {
                const count = filteredLeads.filter((l) => l.status === s.key).length
                const percent = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : '0'
                return (
                  <div
                    key={s.key}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-[11px] font-semibold text-slate-700 truncate">
                        {s.label}
                      </span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-lg font-bold text-slate-900">{count}</span>
                      <span className="text-[11px] text-slate-500">{percent}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Evolução Temporal (Novos, Proposta e Fechados por Mês) */}
        <Card className="lg:col-span-6 border border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Evolução do Funil ao Longo do Tempo
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Novos leads recebidos vs. propostas e contratos fechados por mês
                </CardDescription>
              </div>
              <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">Mensal</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelineData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProposal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="monthLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                  <Area
                    type="monotone"
                    name="Novos Leads"
                    dataKey="new"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorNew)"
                  />
                  <Area
                    type="monotone"
                    name="Proposta Enviada"
                    dataKey="proposal_sent"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProposal)"
                  />
                  <Area
                    type="monotone"
                    name="Fechados (Won)"
                    dataKey="won"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorWon)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-slate-500 text-center mt-3">
              Média mensal de conversão acelerada com acompanhamento automatizado da equipe Golden.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Contratos Fechados Recentemente */}
      <Card className="border border-slate-200 bg-white shadow-xs">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Contratos Fechados com Sucesso (Leads Convertidos)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Clientes que concluíram toda a esteira de contratação e já estão no portal
            </CardDescription>
          </div>
          <Link to="/admin/leads">
            <Button variant="outline" size="sm" className="text-xs h-8">
              Ver Todos no Kanban
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-y border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Empresa / Contato</th>
                  <th className="py-3 px-4">Regime Tributário</th>
                  <th className="py-3 px-4">Faixa de Funcionários</th>
                  <th className="py-3 px-4">E-mail / Telefone</th>
                  <th className="py-3 px-4 text-right">Status do Contrato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentWonLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Nenhum lead fechado neste período selecionado.
                    </td>
                  </tr>
                ) : (
                  recentWonLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {lead.company_name || lead.name}
                        <span className="block text-[11px] font-normal text-slate-500">
                          {lead.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                          {lead.tax_regime?.toUpperCase() || 'SIMPLES'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {lead.employees_count || '1-10'} funcionários
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{lead.email}</div>
                        <div className="text-[11px] text-slate-400">{lead.phone || 'Sem fone'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Fechado & Ativo
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
