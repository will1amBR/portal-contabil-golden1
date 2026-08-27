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
import { Card, CardContent } from '@/components/ui/card'
import { ValidationBadge } from '@/components/ValidationBadge'
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
  BarChart3,
} from 'lucide-react'
import { format } from 'date-fns'
import TaxObligationsCalendar from '@/components/TaxObligationsCalendar'
import { Button } from '@/components/ui/button'

export default function ClientDashboard() {
  const [docs, setDocs] = useState<Document[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [requirements, setRequirements] = useState<TaxRegimeRequirement[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
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
    { label: 'Total', value: docs.length, icon: FileText, color: 'text-slate-600 bg-slate-50' },
    {
      label: 'Aguard. Confirmação',
      value: pendingConfirmation.length,
      icon: AlertCircle,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Em Validação',
      value: pending.length,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: 'Aprovados',
      value: approved.length,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    { label: 'Rejeitados', value: rejected.length, icon: XCircle, color: 'text-red-600 bg-red-50' },
  ]

  const recent = [...docs]
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .slice(0, 5)

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
            Dashboard do Cliente
          </h1>
          <p className="text-slate-500">Visão geral dos seus documentos e obrigações fiscais.</p>
        </div>
        <Link to="/relatorios">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" /> Relatório Mensal
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div
                className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calendário de Obrigações Fiscais */}
      <TaxObligationsCalendar companies={companies} requirements={requirements} />

      {/* Documentos Recentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Documentos Recentes</h2>
          <Link
            to="/cliente/documentos"
            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center text-slate-400">
              Nenhum documento encontrado. Faça upload do seu primeiro documento.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recent.map((doc) => (
              <Card key={doc.id} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">{doc.title}</h4>
                    <p className="text-xs text-slate-500">
                      {format(new Date(doc.created), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <ValidationBadge status={doc.validation_status || 'pending'} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
