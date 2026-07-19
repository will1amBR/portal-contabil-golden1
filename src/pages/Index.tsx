import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDocuments, getCompanies, type Document, type Company } from '@/services/api'
import { AlertCircle, CheckCircle2, Clock, Users } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function Index() {
  const { isAccountant, user } = useAuth()
  const [docs, setDocs] = useState<Document[]>([])
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    getDocuments().then(setDocs)
    if (isAccountant) getCompanies().then(setCompanies)
  }, [isAccountant])

  const pendingDocs = docs.filter((d) => d.payment_status === 'pending')

  const chartData = [
    { name: 'Entregue', value: docs.length - pendingDocs.length, fill: 'var(--color-success)' },
    { name: 'Pendente', value: pendingDocs.length, fill: 'var(--color-warning)' },
  ]

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Olá, {user?.name.split(' ')[0]}
        </h1>
        <p className="text-slate-500 mt-1">Resumo das suas atividades e pendências.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isAccountant ? (
          <Card className="border-0 shadow-subtle">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total de Clientes
              </CardTitle>
              <Users className="w-4 h-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{companies.length}</div>
            </CardContent>
          </Card>
        ) : null}

        <Card className="border-0 shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Impostos Pendentes</CardTitle>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{pendingDocs.length}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Documentos Recentes
            </CardTitle>
            <Clock className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{docs.slice(0, 5).length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-subtle">
          <CardHeader>
            <CardTitle>Compliance e Entregas</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            {docs.length > 0 ? (
              <ChartContainer
                config={{
                  success: { color: 'hsl(160 84% 39%)' },
                  warning: { color: 'hsl(38 92% 50%)' },
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
                      innerRadius={60}
                      outerRadius={80}
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
              <div className="h-full flex items-center justify-center text-slate-400">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-subtle">
          <CardHeader>
            <CardTitle>Atenção Crítica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDocs.length === 0 && <p className="text-slate-500 text-sm">Tudo em dia!</p>}
              {pendingDocs.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg border border-amber-100"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{doc.title}</p>
                    <p className="text-xs text-amber-700">Pagamento Pendente</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
