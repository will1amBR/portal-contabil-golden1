import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDocuments, getCompanies, type Document, type Company } from '@/services/api'
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
} from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Index() {
  const { isAccountant, user } = useAuth()
  const [docs, setDocs] = useState<Document[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [d, c] = await Promise.all([
          getDocuments(),
          isAccountant ? getCompanies() : Promise.resolve([]),
        ])
        setDocs(d)
        if (c) setCompanies(c)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAccountant])

  const pendingDocs = docs.filter((d) => d.payment_status === 'pending')
  const approvedDocs = docs.filter((d) => d.validation_status === 'approved')
  const pendingValidation = docs.filter((d) => d.validation_status === 'pending')
  const pendingConfirmation = docs.filter((d) => d.validation_status === 'pending_confirmation')

  const chartData = [
    { name: 'Aprovados', value: approvedDocs.length, fill: '#10b981' },
    { name: 'Em Validação', value: pendingValidation.length, fill: '#f59e0b' },
    { name: 'Aguard. Confirmação', value: pendingConfirmation.length, fill: '#6366f1' },
  ].filter((item) => item.value > 0)

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isAccountant ? 'Golden Contabilidade &bull; Painel Geral' : 'Portal da Empresa'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Olá, {user?.name?.split(' ')[0] || 'Usuário'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              {isAccountant
                ? 'Monitore o fluxo de arquivos enviados pelos clientes, pendências fiscais e triagens com IA.'
                : 'Visão consolidada da saúde fiscal e do fluxo de documentos da sua empresa.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/relatorios">
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2"
              >
                <BarChart3 className="w-4 h-4 text-emerald-400" /> Relatório Mensal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {isAccountant ? (
          <Card className="border border-slate-200/90 shadow-xs bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Empresas Ativas
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="text-3xl font-bold text-slate-900">{companies.length}</div>
              <p className="text-xs text-slate-500 mt-1">sob gestão contábil</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-slate-200/90 shadow-xs bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Documentos Totais
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="text-3xl font-bold text-slate-900">{docs.length}</div>
              <p className="text-xs text-slate-500 mt-1">arquivados no portal</p>
            </CardContent>
          </Card>
        )}

        <Card className="border border-slate-200/90 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Aguardando IA
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold text-slate-900">{pendingConfirmation.length}</div>
            <p className="text-xs text-slate-500 mt-1">para triagem de categoria</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/90 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Em Validação
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold text-slate-900">{pendingValidation.length}</div>
            <p className="text-xs text-slate-500 mt-1">na esteira de aprovação</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/90 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Guias a Pagar
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold text-slate-900">{pendingDocs.length}</div>
            <p className="text-xs text-slate-500 mt-1">com pagamento pendente</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Quick Attention Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Pie Chart */}
        <Card className="border border-slate-200/90 shadow-xs bg-white">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-bold text-slate-900">
              Distribuição do Status dos Documentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 h-[260px]">
            {chartData.length > 0 ? (
              <ChartContainer
                config={{
                  approved: { color: '#10b981' },
                  pending: { color: '#f59e0b' },
                  confirmation: { color: '#6366f1' },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Nenhum dado disponível para compor o gráfico.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Critical Attention Box */}
        <Card className="border border-slate-200/90 shadow-xs bg-white">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900">
              Atenção & Vencimentos Pendentes
            </CardTitle>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-semibold">
              {pendingDocs.length} guias
            </Badge>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            <div className="space-y-3">
              {pendingDocs.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  <p className="font-semibold text-slate-700">Tudo em conformidade!</p>
                  <p>Nenhuma guia ou imposto com pagamento em aberto.</p>
                </div>
              ) : (
                pendingDocs.slice(0, 4).map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3.5 p-3 bg-amber-50/60 rounded-xl border border-amber-200/70"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{doc.title}</p>
                      <p className="text-[11px] text-amber-800 font-medium mt-0.5">
                        Pagamento Pendente &bull; {doc.expand?.company?.name || 'Empresa'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
